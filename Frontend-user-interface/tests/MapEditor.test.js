import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MapEditor from '../src/pages/MapEditor';
import { BrowserRouter as Router } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Define variables for the Firebase app and auth instances
let app;
let auth;

// Before each test, initialize the Firebase app and auth instances
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

// Mock the firebase/auth module
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn().mockReturnValue({
        currentUser: { uid: '9bbH7U3A6kNuXnzt9wQnIs9wUQ82' },
    }),
}));

describe('MapEditor', () => {

    /**
     * Test case for rendering the MapEditor component.
     *
     * This test renders the MapEditor component inside a Router component,
     * and then checks if the text 'Edition de carte' is present in the document.
     */
    test('renders MapEditor component', () => {
        render(<Router><MapEditor /></Router>);
        expect(screen.getByText('Edition de carte')).toBeInTheDocument();
    });

    /**
     * Test case for changing the tool on radio button click.
     *
     * This test simulates a click event on the 'Gomme' radio button.
     * After the click event, it waits for the 'Gomme' radio button to be checked.
     */
    test('changes tool on radio button click', async () => {
        render(<Router><MapEditor /></Router>);
        fireEvent.click(screen.getByLabelText('Gomme'));
        await waitFor(() => expect(screen.getByLabelText('Gomme')).toBeChecked());
    });

    /**
     * Test case for changing the line width on slider change.
     *
     * This test simulates a change event on the first slider.
     * The change event sets the value of the slider to 5.
     * After the change event, it waits for the value of the slider to be '5'.
     */
    test('changes line width on slider change', async () => {
        render(<Router><MapEditor /></Router>);
        const sliders = screen.getAllByRole('slider');
        const slider = sliders[0];
        fireEvent.change(slider, { target: { value: 5 } });
        await waitFor(() => expect(slider.value).toBe('5'));
    });

    /**
     * Test case for changing the map size on select change.
     *
     * This test simulates a mouse down event on the first select box and a click event on the 'Moyenne' menu item.
     * After the click event, it waits for the text content of the select box to be 'Moyenne'.
     */
    test('changes map size on select change', async () => {
        render(<Router><MapEditor /></Router>);
        const selects = screen.getAllByRole('combobox');
        const select = selects[0];
        fireEvent.mouseDown(select);
        const menuItem = screen.getByText('Moyenne');
        fireEvent.click(menuItem);
        await waitFor(() => expect(select.textContent).toBe('Moyenne'));
    });

    /**
     * Test case for changing the line color on color picker change.
     *
     * This test simulates a change event on the color picker.
     * The change event sets the value of the color picker to '#000000'.
     * After the change event, it checks if the value of the color picker is '#000000'.
     */
    test('changes line color on color picker change', () => {
        render(<Router><MapEditor /></Router>);
        const colorPicker = screen.getByTestId('colorPickerPencil');
        fireEvent.change(colorPicker, { target: { value: '#000000' } });
        expect(colorPicker.value).toBe('#000000');
    });

    /**
     * Test case for the popup behavior.
     *
     * This test simulates a click event on the 'Enregistrer' button.
     * After the click event, it checks if the text 'Enregistrer la carte' is present in the document.
     * Then it simulates a change event on the textbox in the popup, setting its value to an empty string, and a click event on the 'Enregistrer' button in the popup.
     * After the click event, it checks if the alert text appears with the right content.
     * Then it simulates another change event on the textbox in the popup, setting its value to 'TestMap$', and another click event on the 'Enregistrer' button in the popup.
     * After the click event, it checks again if the alert text appears with the right content.
     */
    test('tests the popup behavior', async () => {
        render(<Router><MapEditor /></Router>);

        const saveButtons = screen.getAllByText('Enregistrer');
        fireEvent.click(saveButtons[0]);
        expect(await screen.findByText('Enregistrer la carte')).toBeInTheDocument();

        const input = screen.getByRole('textbox');
        const saveButtonsInDialog = await screen.findAllByText('Enregistrer');

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(saveButtonsInDialog[1]);
        expect(await screen.findByRole('alert')).toHaveTextContent('Nom invalide. Pas de caractères spéciaux et minimum 2 caractères');

        fireEvent.change(input, { target: { value: 'TestMap$' } });
        fireEvent.click(saveButtonsInDialog[1]); // try to save
        expect(await screen.findByRole('alert')).toHaveTextContent('Nom invalide. Pas de caractères spéciaux et minimum 2 caractères');
    });

});