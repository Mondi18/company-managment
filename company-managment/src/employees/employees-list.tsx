import Table from '@mui/joy/Table';
import { useState, useEffect } from 'react';
import { listEmployees } from '../firebase';
import { Employee } from '../data/type';
import { create, props } from '@stylexjs/stylex';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { deleteEmployee } from '../firebase/index.ts';

const TableStyle = create({

  headerCell: {
    width: '14.2857%',
    textAlign: 'center',
    border: '1px solid #ddd',
    padding: '8px',
  },
  tableCell: {
    textAlign: 'center',
    border: '1px solid #ddd',
    padding: '8px',
  },
  tr: {
    cursor: "pointer"
  },
  bg: {
    backgroundColor: 'bisque'
  },
  button: {
    margin: '0.5rem',
    color: 'red'
  }

});

const EmployeesList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Record<string, Employee> | undefined>(undefined);

  useEffect(() => {
    listEmployees().then(data => {
      if (data) {
        setEmployees(data);
      }
    }).catch(error => {
      console.error("Error when fetching employees:", error);
    });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);

      setEmployees(prevEmployees => {
        if (prevEmployees) {
          const updatedEmployees = { ...prevEmployees };
          delete updatedEmployees[id];
          return updatedEmployees;

        }
        return prevEmployees;
      });
      console.log('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  };


  return (


    <Table>
      <thead>
        <tr>
          <th {...props(TableStyle.headerCell)} >Email</th>
          <th {...props(TableStyle.headerCell)}>Last Name</th>
          <th {...props(TableStyle.headerCell)}>First Name</th>
          <th {...props(TableStyle.headerCell)}>Phone Number</th>
          <th {...props(TableStyle.headerCell)}>Job Position</th>
          <th {...props(TableStyle.headerCell)}>Level</th>
          <th {...props(TableStyle.headerCell)}>Salary</th>
          <th {...props(TableStyle.headerCell)}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees && Object.entries(employees).map(([id, employee]) => (
          <tr key={id} onClick={() => navigate("/employees-edit")} {...props(TableStyle.tr)}>
            <td {...props(TableStyle.tableCell)}>{employee.email}</td>
            <td {...props(TableStyle.tableCell)}>{employee.lastName}</td>
            <td {...props(TableStyle.tableCell)}>{employee.firstName}</td>
            <td {...props(TableStyle.tableCell)}>{employee.phoneNumber}</td>
            <td {...props(TableStyle.tableCell)}>{employee.jobPosition}</td>
            <td {...props(TableStyle.tableCell)}>{employee.level}</td>
            <td {...props(TableStyle.tableCell)}>{employee.salary}</td>
            <td {...props(TableStyle.tableCell)}>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(id);
                }}
                {...props(TableStyle.button)}
              >
                Delete
              </Button>
            </td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>

  );
}

export default EmployeesList;
