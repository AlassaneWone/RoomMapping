import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Zoom from "../src/pages/Zoom";

// Mocking the useControls hook
jest.mock("react-zoom-pan-pinch", () => {
    const useControls = jest.fn(() => ({
        zoomIn: jest.fn(),
        zoomOut: jest.fn(),
        resetTransform: jest.fn(),
    }));

    return {
        useControls,
        TransformWrapper: ({ children }) => <div>{children}</div>,
        TransformComponent: ({ children }) => <div>{children}</div>,
    };
});

describe("Zoom component", () => {

    /**
     * Test case for rendering the Zoom component without crashing.
     *
     * This test renders the Zoom component and checks if the container is present.
     */
    it("renders without crashing", () => {
        const { container } = render(<Zoom />);
        expect(container).toBeTruthy();
    });

    /**
     * Test case for rendering the image with the correct URL.
     *
     * This test renders the Zoom component with a specific image URL,
     * and then checks if the image element is present and has the correct source URL.
     */
    it("renders the image with the correct URL", () => {
        const imageUrl = "https://example.com/image.jpg";
        const { getByAltText } = render(<Zoom imageUrl={imageUrl} />);
        const imageElement = getByAltText("Image");
        expect(imageElement).toBeInTheDocument();
        expect(imageElement.src).toBe(imageUrl);
    });

    /**
     * Test case for checking the click functionality of buttons.
     *
     * This test renders the Zoom component and tests the button click functionality.
     * The specific button click functionality is not tested in this placeholder.
     */
    it("buttons are clickable", () => {
        const { getByText } = render(<Zoom />);
        // Test the button click functionality here
    });
});
