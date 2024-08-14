import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { JobPosition } from '../data/type'
import { Level } from '../data/type'
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
});

function EmployeesEdit() {
    return (
        <div {...props(FormStyle.base)}>
            <div {...props(FormStyle.textFieldContainer)}>
                <div {...props(FormStyle.row)}>
                    <TextField
                        id="first-name"
                        label="First Name"
                        variant="filled"
                        {...props(FormStyle.textField)}
                    />
                    <TextField
                        id="last-name"
                        label="Last Name"
                        variant="filled"
                        {...props(FormStyle.textField)}
                    />
                </div>
                <div {...props(FormStyle.row)}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="filled"
                        {...props(FormStyle.textField)}
                    />
                    <TextField
                        id="phone-number"
                        label="Phone Number"
                        variant="filled"
                        {...props(FormStyle.textField)}
                    />
                </div>
            </div>
            <FormControlLabel control={<Checkbox />} label="Busy" />
            <FormControl variant="filled" {...props(FormStyle.formControl)}>
                <InputLabel id="job-position-label">Job Position</InputLabel>
                <Select
                    labelId="job-position-label"
                    id="job-position-select"
                    defaultValue=""
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
                    defaultValue=""
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
        </div>
    );
}

export default EmployeesEdit;
