import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MapEditor from '../src/pages/MapEditor';
import { BrowserRouter as Router } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let app;
let auth;

beforeEach(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyB13ENRoOYEaalMbFrT8o7ASPozdnB8J44",
        authDomain: "roommapping-group-5.firebaseapp.com",
        projectId: "roommapping-group-5",
        storageBucket: "roommapping-group-5.appspot.com",
        messagingSenderId: "1043815402453",
        appId: "1:1043815402453:web:7f0037a654ac2bd88d8b5c"
    };

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
});

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn().mockReturnValue({
        currentUser: { uid: '9bbH7U3A6kNuXnzt9wQnIs9wUQ82' },
    }),
}));

describe('MapEditor', () => {
    test('renders MapEditor component', () => {
        render(<Router><MapEditor /></Router>);
        expect(screen.getByText('Edition de carte')).toBeInTheDocument();
    });

    test('changes tool on radio button click', async () => {
        render(<Router><MapEditor /></Router>);
        fireEvent.click(screen.getByLabelText('Gomme'));
        await waitFor(() => expect(screen.getByLabelText('Gomme')).toBeChecked());
    });

    test('changes line width on slider change', async () => {
        render(<Router><MapEditor /></Router>);
        const sliders = screen.getAllByRole('slider');
        const slider = sliders[0];
        fireEvent.change(slider, { target: { value: 5 } });
        await waitFor(() => expect(slider.value).toBe('5'));
    });

    test('changes map size on select change', async () => {
        render(<Router><MapEditor /></Router>);
        const selects = screen.getAllByRole('combobox');
        const select = selects[0];
        fireEvent.mouseDown(select);
        const menuItem = screen.getByText('Moyenne');
        fireEvent.click(menuItem);
        await waitFor(() => expect(select.textContent).toBe('Moyenne'));
    });

    test('changes line color on color picker change', () => {
        render(<Router><MapEditor /></Router>);
        const colorPicker = screen.getByTestId('colorPickerPencil');
        fireEvent.change(colorPicker, { target: { value: '#000000' } });
        expect(colorPicker.value).toBe('#000000');
    });

    test('tests the popup behavior', async () => {
        render(<Router><MapEditor /></Router>);

        const saveButtons = screen.getAllByText('Enregistrer');
        fireEvent.click(saveButtons[0]); // open the popup
        expect(await screen.findByText('Enregistrer la carte')).toBeInTheDocument(); // check that the dialog is displayed

        const input = screen.getByRole('textbox');
        const saveButtonsInDialog = await screen.findAllByText('Enregistrer');

        fireEvent.change(input, { target: { value: '' } }); // enter an empty string
        fireEvent.click(saveButtonsInDialog[1]); // try to save
        expect(await screen.findByRole('alert')).toHaveTextContent('Nom invalide. Pas de caractères spéciaux et minimum 2 caractères');

        // Test with a string with special characters
        fireEvent.change(input, { target: { value: 'TestMap$' } }); // enter a string with special characters
        fireEvent.click(saveButtonsInDialog[1]); // try to save
        expect(await screen.findByRole('alert')).toHaveTextContent('Nom invalide. Pas de caractères spéciaux et minimum 2 caractères');
    });

});