import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import MapList from "../src/pages/MapList";
import '@testing-library/jest-dom/extend-expect';

const authMock = {
    onAuthStateChanged: jest.fn(),
};
const getAuth = jest.fn(() => authMock);

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));


describe('Map publishing', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });
    test("Render sans erreurs", () => {
        render(<MapList/>);
    });

    test("Fetch l'id du user correctement", () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<MapList/>);
    });
    test("Fetch maps correctement", async () => {
        const fakeUsers = [
            { mapId: '2xvhOSc2jjPlbqngH0j9', url: 'test'}
        ]
        fetchMock.mockResolvedValue({ status: 200, json: jest.fn(() => fakeUsers) })
        render(<MapList/>);
        await waitFor(() => {
            expect(screen.getByAltText('Image 2xvhOSc2jjPlbqngH0j9')).toBeInTheDocument();
        })
        // expect(await screen.findByAltText('Image 2xvhOSc2jjPlbqngH0j9')).toBeInTheDocument();
    })

});