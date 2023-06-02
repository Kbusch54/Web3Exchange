export const convertCamelCaseToTitle = (camelCaseString: string) => {
    // Replace uppercase letters with a space followed by the uppercase letter
    const spacedString = camelCaseString.replace(/([A-Z])/g, ' $1');
    // Convert the string to uppercase
    const allCapsString = spacedString.toUpperCase();
    // Remove leading space if present
    const trimmedString = allCapsString.trim();
    // Return the final converted string
    return trimmedString;
};