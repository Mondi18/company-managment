import { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button';
import { addEmployees } from '../firebase/index.ts'
import { Employee, JobPosition, Level } from '../data/type'
import { create, props } from '@stylexjs/stylex'

const FormStyle = create({
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2rem',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '1rem',
        gap: '2rem'
    },
    textField: {
        marginRight: '1rem',
        flex: 1,
        minWidth: '120px',
    },
    textFieldContainer: {
        width: '100%',
        maxWidth: '600px',
    },
    formControl: {
        marginTop: '1rem',
        width: '100%',
        maxWidth: '600px',
    },
    errorMessage:{
     marginTop:'2rem',
     fontWeight:'bolder',
     color:'red'
    }
});

function EmployeesEdit() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isBusy, setIsBusy] = useState(false);
    const [jobPosition, setJobPosition] = useState<JobPosition | ''>('');
    const [level, setLevel] = useState<Level | ''>('');
    const [salary, setSalary] = useState(0);
    const [errorMessage,setErrorMessage]=useState<string | null>(null);    

    const handleSubmit = async () => {
        if (!firstName || !lastName || !email || !phoneNumber || !jobPosition || !level || !salary) {
            setErrorMessage('Please fill in all fields');
            return;
        }
        const newEmployee: Employee = {
            firstName,
            lastName,
            email,
            phoneNumber,
            level,
            jobPosition,
            salary,
            isBusy
        };
        try {
            await addEmployees(newEmployee);
            console.log('Employee added successfully!');

            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber('');
            setLevel('');
            setJobPosition('');
            setIsBusy(false);
            setSalary(0);
        } catch (error) {
            console.error('Error adding employee:', error)
        }

    };
    return (
        <div {...props(FormStyle.base)}>
            <div {...props(FormStyle.textFieldContainer)}>
                <div {...props(FormStyle.row)}>
                    <TextField
                        id="first-name"
                        label="First Name"
                        variant="filled"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        {...props(FormStyle.textField)}
                    />
                    <TextField
                        id="last-name"
                        label="Last Name"
                        variant="filled"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        {...props(FormStyle.textField)}
                    />
                </div>
                <div {...props(FormStyle.row)}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        {...props(FormStyle.textField)}
                    />
                    <TextField
                        id="phone-number"
                        label="Phone Number"
                        variant="filled"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        {...props(FormStyle.textField)}
                    />
                    <TextField
                        id="salary"
                        label="Salary"
                        type="number"
                        variant="filled"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value ? parseFloat(e.target.value) : 0)}
                        {...props(FormStyle.textField)}
                    />
                </div>
            </div>
            <FormControlLabel control={<Checkbox checked={isBusy} onChange={() => setIsBusy(!isBusy)} />} label="Busy" />
            <FormControl variant="filled" {...props(FormStyle.formControl)}>
                <InputLabel id="job-position-label">Job Position</InputLabel>
                <Select
                    labelId="job-position-label"
                    id="job-position-select"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value as JobPosition)}
                >
                    {Object.values(JobPosition)
                        .filter(value => typeof value === 'string')
                        .map((position) => (
                            <MenuItem key={position} value={position}>
                                {position}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl variant="filled" {...props(FormStyle.formControl)}>
                <InputLabel id="level-label">Level</InputLabel>
                <Select
                    labelId="level-label"
                    id="level-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    >
                    {Object.values(Level)
                        .filter(value => typeof value === 'string')
                        .map((level) => (
                            <MenuItem key={level} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <Button
                type="button"
                variant="contained"
                onClick={handleSubmit}
                style={{ marginTop: '2rem' }}
                >
                Add Employee
            </Button>
        <span {...props(FormStyle.errorMessage)}>{errorMessage}</span>
        </div>
    );
}

export default EmployeesEdit;
