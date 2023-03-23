import express from 'express';
import { IResponse } from './IResponse';
import { JSDOM } from 'jsdom';
import axios, { AxiosError } from 'axios';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  getData()
    .then(function (data) {
      console.log('data', data);
      res.setHeader('Content-Type', 'text/plain');
      res.send(data);
    })
    .catch(function (e) {
      res.status(500);
      res.send(e);
    });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

function fetchPage(url: string): Promise<string | undefined> {
  const html = axios
    .get(url)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config.url}.`);
      console.error(error.toJSON());
    });

  return html;
}

async function fetchHtml(url: string): Promise<Document> {
  console.log(`I fetched ${url} fresh`);
  const html = await fetchPage(url);
  const dom = new JSDOM(html);
  return dom.window.document;
}
function formatData(document: Document) {
  const postings = document.querySelectorAll('.job-posting');
  const response = {};
  postings.forEach((posting) => {
    const department = posting.querySelector('.department').innerHTML;
    response[department] = {};
    response[department].listings = [];
    posting.querySelectorAll('.job-name').forEach((listing) => {
      response[department].listings.push(listing.innerHTML);
    });
  });

  return response;
}

async function getData() {
  const document = await fetchHtml('https://www.actian.com/company/careers/');
  const data = formatData(document);
  return data;
}
