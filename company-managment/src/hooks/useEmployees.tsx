import { useState, useEffect } from 'react';
import { listEmployees } from '../firebase';
import { Employee } from '../data/type';

const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeesData = await listEmployees();
                if (employeesData) {
                    const formattedEmployees = Object.entries(employeesData).map(([id, employee]) => ({
                        ...employee,
                        id
                    }));
                    setEmployees(formattedEmployees);
                } else {
                    setEmployees([]);
                }
            } catch (e) {
                console.log(e)
                setError('Failed fetch Employees!');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { employees, loading, error };
};
export default useEmployees