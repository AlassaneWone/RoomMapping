const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:5000/api/game';

describe("POST /api/game", () => {
    test("Test de l'ajout d un match valide", async () => {
        const data = {
            userId: 'userTests',
            mapId: 'mapTests',
            name: 'Test Game',
            date: '2024-01-01T12:00:00Z',
            teams: [{name: 'Team A', roomId: 'm3onj5'}, {name: 'Team B', roomId: '8rsjb1'}]
        };

        const response = await axios.post('/', data);
        expect(response.status).toBe(201)
    });

    test("Test de l'ajout d un match avec un nom invalide", async () => {
        const data = {
            userId: 'userTests',
            mapId: 'mapTests',
            name: null,
            date: '2025-01-01T12:00:00Z',
            teams: [{name: 'Team A', roomId: 'm3onj5'}, {name: 'Team B', roomId: '8rsjb1'}]
        }
        await expect(axios.post('/', data)).rejects.toThrow();

        try {
            await axios.post('/', data);
        } catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data.errors).toEqual(['name must be a string']);
        }

    });

    test("Test de l'ajout d un match avec une date invalide", async () => {
        const data = {
            userId: 'userTests',
            mapId: 'mapTests',
            name: 'test',
            date: '2022-01-01T12:00:00Z',
            teams: [{name: 'Team A', roomId: 'm3onj5'}, {name: 'Team B', roomId: '8rsjb1'}]
        }
        await expect(axios.post('/', data)).rejects.toThrow();

        try {
            await axios.post('/', data);
        } catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data.errors).toEqual(["date must be a string, must be in a date format and must be in the future"]);
        }
    });

    test("Test de l'ajout d un match tout les champs invalides", async () => {
        const data = {
            userId: null,
            mapId: 56,
            name: null,
            date: "2022-01-01T12:00:00Z",
            teams: [{name: 'Team A', roomId: 'm3onj5'}]
        }
        await expect(axios.post('/', data)).rejects.toThrow();

        try {
            await axios.post('/', data);
        } catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data.errors).toEqual(["userId must be a string and not empty",
                "mapId must not be empty and must be a string",
                "name must be a string",
                "date must be a string, must be in a date format and must be in the future",
                "teams must be an array and must contain at least 2 teams"]
            );
        }
    });
});