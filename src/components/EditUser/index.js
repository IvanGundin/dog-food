import React, { useContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import GlobalContext from '../../contexts/globalContext';

import { Grid, Typography, TextField, Button } from '@mui/material';

export const EditUser = () => {
    const { complicatedState, dispatch } = useContext(GlobalContext);
    const [userName, setUserName] = useState('');
    const [userAbout, setUserAbout] = useState('');
    const api = useApi();

    const handleClick = () => {
        api.editCurentUser({ name: userName, about: userAbout })
            .then((data) => {
                dispatch({ type: 'edit user', payload: data })
            })
            .catch((err) => alert(err));
    };

    useEffect(() => {
        complicatedState.user && setUserName(complicatedState.user.name);
        complicatedState.user && setUserAbout(complicatedState.user.about);
    }, [complicatedState.user]);

    return (
        <Grid container flexDirection='column' spacing='10'>
            <Grid item>
                <Typography variant='h3'>Редактировать пользователя </Typography>
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    label='Имя'
                    variant='outlined'
                    value={userName}
                    onChange={({ target }) => {
                        setUserName(target.value);
                    }}
                />
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    label='Доп.Информация'
                    variant='outlined'
                    value={userAbout}
                    onChange={({ target }) => {
                        setUserAbout(target.value);
                    }}
                />
            </Grid>
            <Grid item>
                <Button onClick={handleClick} variant='contained' color='secondary' size='small'>
                    Сохранить
                </Button>
            </Grid>
        </Grid>
    );
};
