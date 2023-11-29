import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import NewGame from "../src/pages/NewGame";
import '@testing-library/jest-dom/extend-expect';

const fetchMock = jest.fn();
global.fetch = fetchMock;
const authMock = {
    onAuthStateChanged: jest.fn(),
};
const getAuth = jest.fn(() => authMock);

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));

describe("NewGame Component", () => {
    test("Render sans erreurs", () => {
        render(<NewGame/>);
    });

    test("Fetch l'id du user correctement", () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<NewGame/>);
    });

    test("Mets bien à jour la valeur du nom du match", () => {
        render(<NewGame/>);
        const gameNameInput = screen.getByLabelText("Nom du match:");
        fireEvent.change(gameNameInput, {target: {value: "Test Game"}});
        expect(gameNameInput.value).toBe("Test Game");
    });


    test("Mets bien à jour la valeur de la date", () => {
        render(<NewGame/>);
        const gameDateInput = screen.getByLabelText("Date:");
        fireEvent.change(gameDateInput, {target: {value: "2024-01-01"}});
        expect(gameDateInput.value).toBe("2024-01-01");
    });

    test("Mets bien à jour la valeur de l'heure", () => {
        render(<NewGame/>);
        const gameTimeInput = screen.getByLabelText("Heure:");
        fireEvent.change(gameTimeInput, {target: {value: "12:00"}});
        expect(gameTimeInput.value).toBe("12:00");
    });

    test("Bouton ajouter une équipe fontionnel", () => {
        render(<NewGame/>);

        const teamsBeforeAdding = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        expect(teamsBeforeAdding).toHaveLength(2);

        const addTeamButton = document.getElementsByClassName("addTeamButton")[0];
        fireEvent.click(addTeamButton);

        const teamsAfterAdding = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        expect(teamsAfterAdding).toHaveLength(3);

        const teamContainers = screen.getAllByTestId("team-container");
        expect(teamContainers).toHaveLength(3);
    });

    test("Soumet le formulaire avec le champ date invalide (date dans le passé)", async () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<NewGame/>);
        const gameNameInput = screen.getByLabelText("Nom du match:");
        const gameDateInput = screen.getByLabelText("Date:");
        const gameTimeInput = screen.getByLabelText("Heure:");

        fireEvent.change(gameNameInput, {target: {value: "Test Game"}});
        fireEvent.change(gameDateInput, {target: {value: "2022-01-01"}});
        fireEvent.change(gameTimeInput, {target: {value: "12:00"}});

        const addTeamButton = screen.getByText("Ajouter une équipe");
        fireEvent.click(addTeamButton);

        const teamInputs = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        fireEvent.change(teamInputs[0], {target: {value: "Team A"}});
        fireEvent.change(teamInputs[1], {target: {value: "Team B"}});
        fireEvent.change(teamInputs[2], {target: {value: "Team C"}});

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("La date et l'heure ne peuvent pas être antérieures à la date actuelle")).toBeInTheDocument();
        });
    });

    test("Message d'erreur lors de la soumission du formulaire avec le champ \"Nom du match:\" vide", async () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<NewGame/>);
        const gameDateInput = screen.getByLabelText("Date:");
        const gameTimeInput = screen.getByLabelText("Heure:");

        fireEvent.change(gameDateInput, {target: {value: "2022-01-01"}});
        fireEvent.change(gameTimeInput, {target: {value: "12:00"}});

        const addTeamButton = screen.getByText("Ajouter une équipe");
        fireEvent.click(addTeamButton);

        const teamInputs = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        fireEvent.change(teamInputs[0], {target: {value: "Team A"}});
        fireEvent.change(teamInputs[1], {target: {value: "Team B"}});
        fireEvent.change(teamInputs[2], {target: {value: "Team C"}});

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);

        expect(screen.getByText("Veuillez compléter le(s) champ(s) : Nom du match")).toBeInTheDocument();
    });
    test("Message d'erreur lors de la soumission du formulaire avec le champ \"Date:\" vide", async () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<NewGame/>);
        const gameNameInput = screen.getByLabelText("Nom du match:");
        const gameTimeInput = screen.getByLabelText("Heure:");

        fireEvent.change(gameNameInput, {target: {value: "Test Game"}});
        fireEvent.change(gameTimeInput, {target: {value: "12:00"}});

        const addTeamButton = screen.getByText("Ajouter une équipe");
        fireEvent.click(addTeamButton);

        const teamInputs = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        fireEvent.change(teamInputs[0], {target: {value: "Team A"}});
        fireEvent.change(teamInputs[1], {target: {value: "Team B"}});
        fireEvent.change(teamInputs[2], {target: {value: "Team C"}});

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);

        expect(screen.getByText("Veuillez compléter le(s) champ(s) : Date")).toBeInTheDocument();
    });
    test("Message d'erreur lors de la soumission du formulaire avec le champ \"Heure:\" vide", async () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<NewGame/>);
        const gameNameInput = screen.getByLabelText("Nom du match:");
        const gameDateInput = screen.getByLabelText("Date:");

        fireEvent.change(gameNameInput, {target: {value: "Test Game"}});
        fireEvent.change(gameDateInput, {target: {value: "2024-01-01"}});

        const addTeamButton = screen.getByText("Ajouter une équipe");
        fireEvent.click(addTeamButton);

        const teamInputs = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        fireEvent.change(teamInputs[0], {target: {value: "Team A"}});
        fireEvent.change(teamInputs[1], {target: {value: "Team B"}});
        fireEvent.change(teamInputs[2], {target: {value: "Team C"}});

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);

        expect(screen.getByText("Veuillez compléter le(s) champ(s) : Heure")).toBeInTheDocument();
    });
    test("Message d'erreur lors de la soumission du formulaire avec un champ \"Nom de l'équipe\" vide", async () => {
        const mockUserId = "mock-user-id";
        getAuth.mockReturnValue({
            onAuthStateChanged: jest.fn((callback) => callback({uid: mockUserId})),
        });
        render(<NewGame/>);
        const gameNameInput = screen.getByLabelText("Nom du match:");
        const gameDateInput = screen.getByLabelText("Date:");
        const gameTimeInput = screen.getByLabelText("Heure:");

        fireEvent.change(gameNameInput, {target: {value: "Test Game"}});
        fireEvent.change(gameDateInput, {target: {value: "2024-01-01"}});
        fireEvent.change(gameTimeInput, {target: {value: "12:00"}});

        const addTeamButton = screen.getByText("Ajouter une équipe");
        fireEvent.click(addTeamButton);

        const teamInputs = screen.getAllByPlaceholderText(/Nom de l'équipe/);
        fireEvent.change(teamInputs[0], {target: {value: "Team A"}});
        fireEvent.change(teamInputs[1], {target: {value: "Team B"}});
        //fireEvent.change(teamInputs[2], { target: { value: "Team C" } });

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);

        expect(screen.getByText("Veuillez compléter le(s) champ(s) : Équipes")).toBeInTheDocument();
    });
});
