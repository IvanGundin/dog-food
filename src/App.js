import React, { useEffect, useReducer, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';

import Logo from './components/Logo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { List } from './components/List';
import { Search } from './components/Search';
import { Item } from './components/Item';
import { CreateItem } from './components/CreateItem';
import { EditItem } from './components/EditItem';
import { Info } from './components/Info';
import Modal from './components/Modal';
import { FormModal } from './components/FormModal';
import { EditUser } from './components/EditUser';

import GlobalContext from './contexts/globalContext';

import { useApi } from './hooks/useApi';
import { useLocalStorage } from './hooks/useLocalStorage';
// import { Button } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#fed700;',
        },
        secondary: {
            main: '#FF0000',
        },
        info: {
            main: '#212121',
        },
    },
});

function reducer(state, action) {
    switch (action?.type) {
        // case 'add user':
        //     return {
        //         ...state,
        //         user: action.payload
        //     }
        case 'remove user':
            return {
                ...state,
                user: null
            }
        case 'edit user':
            return {
                ...state,
                user: action.payload
            }
        case 'open modal':
            return {
                ...state,
                modalState: {
                    isOpen: true,
                    msg: action.payload,
                }
            }
        case 'close modal':
            return {
                ...state,
                modalState: {
                    isOpen: false,
                    msg: null
                }
            }
        case 'open form':
            return {
                ...state,
                modalFormState: {
                    isOpen: true,
                    msg: action.payload,
                }
            }
        case 'close form':
            return {
                ...state,
                modalFormState: {
                    isOpen: false,
                    msg: null,
                }
            }
        default:
            return { ...state }
    }
}

export const App = () => {
    const api = useApi();

    const [complicatedState, dispatch] = useReducer(reducer, {
        modalState: {
            isOpen: false,
            msg: null,
        },
        modalFormState: {
            isOpen: false,
            msg: null,
        }
    });
    // console.log(complicatedState)

    const { readLS } = useLocalStorage();
    const [foodList, setFoodList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [basket, setBasket] = useState(readLS('basket') || []);
    const [favorites, setFavorites] = useState(readLS('favorites') || []);

    const handleChangeSearchInput = (value) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        const token = readLS('token');
        if (!token) {
            dispatch({ type: 'open form', payload: 'Вы не авторизованы!' })
        };
        api.getCurentUser()
            .then((user) => {
                complicatedState.user = user;
            });
    }, []);

    useEffect(() => {
        api.search(searchQuery).then((list) => setFoodList(list));
    }, [searchQuery, complicatedState.user]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalContext.Provider value={{ complicatedState, dispatch }}>
                <Modal />
                <FormModal />
                <div className='appContainer'>
                    {/* <pre>{JSON.stringify(complicatedState, null, 4)}</pre>
                    <Button onClick={() => dispatch({ type: 'add user', payload: 'hola' })}>TEST</Button> */}
                    <Header>
                        <Logo />
                        <Search setQuery={handleChangeSearchInput} />
                        <Info basket={basket} favorites={favorites} />
                    </Header>
                    <div className='content container'>
                        <Routes>
                            <Route
                                path='/'
                                element={
                                    <div className='content__cards'>
                                        <List
                                            list={foodList}
                                            basket={basket}
                                            setBasket={setBasket}
                                            favorites={favorites}
                                            setFavorites={setFavorites}
                                        />
                                    </div>
                                }
                            />
                            <Route path='product/:itemID' element={<Item changeList={setFoodList} />} />
                            <Route path='product/:itemID/edit' element={<EditItem />} />
                            <Route path='product/create' element={<CreateItem changeList={setFoodList} />} />
                            <Route path='user/edit' element={<EditUser />} />
                            <Route path='about' element={<div>PAGE ABOUT</div>} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </GlobalContext.Provider>
        </ThemeProvider>
    );
};