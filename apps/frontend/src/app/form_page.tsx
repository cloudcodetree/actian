import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

interface FormValues {
  departmentField: string;
  jobField: string;
}
interface Response {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const initialValues: FormValues = {
  departmentField: '',
  jobField: '',
};

const FormPage: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const [data, setData] = useState<any>({});
  const [jobs, setJobs] = useState<any>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formValues);
  };

  const handleDepartmentFieldChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newValue = event.target.value as string;
    setFormValues((prevValues) => ({
      ...prevValues,
      departmentField: newValue,
    }));
    setJobs(data[event.target.value as string]['listings']);
    console.log(jobs);
    setIsSubmitDisabled(false);
  };

  const handlejobFieldChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newValue = event.target.value as string;
    setFormValues((prevValues) => ({
      ...prevValues,
      jobField: newValue,
    }));
    setIsSubmitDisabled(formValues.departmentField === '' || newValue === '');
  };

  return (
    <>
      {/* <div>{JSON.stringify(data, null, 4)}</div> */}
      <br />
      <br />
      <form onSubmit={handleFormSubmit}>
        <FormControl required fullWidth>
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            label="Deparment"
            id="department-field"
            value={formValues.departmentField}
            onChange={handleDepartmentFieldChange}
          >
            {Object.keys(data).map((key, index) => {
              return (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl required fullWidth>
          <InputLabel id="job-field-label">Job</InputLabel>
          <Select
            labelId="job-field-label"
            label="Jobs"
            id="job-field"
            value={formValues.jobField}
            onChange={handlejobFieldChange}
            disabled={isSubmitDisabled}
          >
            {jobs.map((job) => (
              <MenuItem key={job} value={job}>
                {job}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <Button type="submit" disabled={isSubmitDisabled}>
        Submit
      </Button> */}
      </form>
    </>
  );
};

export default FormPage;
