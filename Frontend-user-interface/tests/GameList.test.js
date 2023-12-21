import '@testing-library/jest-dom/extend-expect';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import GameList from "../src/pages/GameList";

const fetchMock = jest.fn();
global.fetch = fetchMock;

const authMock = {
  currentUser: {
    uid: 'mocked-user-id',
  },
};

// Mockez les fonctions Firebase nécessaires
import { getAuth, onAuthStateChanged } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  __esModule: true,
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => authMock),
  onAuthStateChanged: jest.fn(),
}));

describe("GameList Component", () => {    
  test("Renders GameList after Firebase authentication", async () => {
    const mockUser = { uid: 'mock-user-id' };

    // Utilisez directement les fonctions mockées
    getAuth.mockReturnValueOnce(authMock);
    onAuthStateChanged.mockImplementationOnce((auth, callback) => callback(authMock.currentUser));

    // Mockez la réponse de l'appel API
    const mockApiResponse = 
      [
        {
          gameId: "random-game-id-1",
          date: "2024-12-27T17:28:00.000Z",
          name: "test 1",
          teams: [
            { name: "abc", roomId: "test-room-1-team-1" },
            { name: "def", roomId: "test-room-1-team-2" },
          ],
        },
      ];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockApiResponse),
    });

    const { rerender } = render(<GameList mapId="test-map-id" url="test-url" />);

    // Attendez que l'authentification se produise
    await waitFor(() => {
      expect(screen.getByText("test 1")).toBeInTheDocument();
      console.log(screen.debug());
    });

    mockApiResponse.push(
        {
          gameId: "random-game-id-2",
          date: "2023-12-27T11:34:00.000Z",
          name: "test 2",
          teams: [
            { name: "alpha", roomId: "test-room-2-team-1" },
            { name: "beta", roomId: "test-room-2-team-2" },
            { name: "charlie", roomId: "test-room-2-team-3" },
          ],
        },
    );

      rerender(<GameList mapId="test-map-id" url="test-url" />);

      await waitFor(() => {
        expect(screen.getByText("test 2")).toBeInTheDocument();
        console.log(screen.debug());
      });
  });
});
