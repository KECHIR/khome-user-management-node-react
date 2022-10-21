import { useMemo, useEffect, forwardRef, useState } from 'react';
import { useTable, useRowSelect } from 'react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { deleteUsers, fetchUsersList } from '../services/userService.js';

export default function UsersList() {
    let [usersListData, setUsersListData] = useState([]);

    useEffect(() => {
        (async () => {
            const fetcheUsersList = await fetchUsersList();
            setUsersListData(fetcheUsersList);
        })();

    }, []);

    const data = useMemo(() => usersListData, [usersListData]);

    const columns = useMemo(
        () => [
            {
                Header: 'Prénom',
                accessor: 'firstName', // accessor is the "key" in the data
            },
            {
                Header: 'Nom',
                accessor: 'lastName',
            },
            {
                Header: 'Email',
                accessor: 'email',
            }
        ],
        []
    );

    const IndeterminateCheckbox = forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            return (
                <>
                    <input type="checkbox"  {...rest} />
                </>
            );
        }
    );

    const tableInstance = useTable({ columns, data }, useRowSelect, hooks => {
        hooks.visibleColumns.push(columns => [
            {
                id: 'selection',

                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
            ...columns,
        ]);
    });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
    } = tableInstance;

    const deleteSelectedUsers = (rowsSelected) => {
        (async function () {
            const usersToDelete = rowsSelected.map(r => r.original);
            const res = await deleteUsers(usersToDelete);
            console.log('res', res);
            if (res.ok) {
                const fetcheUsersList = await fetchUsersList();
                console.log('fetcheUsersList',fetcheUsersList);
                setUsersListData(fetcheUsersList);
            }
        })();
    };

    return (
        <div className='users-list'>
            <h2> Liste des utilisateurs </h2>
            {selectedFlatRows.length ? <div>{`${selectedFlatRows.length} sélectionnés`} <IconButton onClick={() => deleteSelectedUsers(selectedFlatRows)}> <DeleteIcon></DeleteIcon> </IconButton> </div> : null}
            {!usersListData.length ? "Aucun utilisateur" : <table className='users-list-table' {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                        </th>
                                    ))}
                            </tr>
                        ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {

                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {
                                                        cell.render('Cell')}
                                                </td>
                                            )
                                        })}
                                </tr>
                            )
                        })}
                </tbody>
            </table>}
        </div>

    );
}