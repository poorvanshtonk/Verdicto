import type { StoredUser, User, SavedDocument } from '../types';

const DB_KEY = 'verdicto_users';
const SECRET_KEY = 'VERDICTO_SECRET_KEY'; // A simple key for demo purposes.

// Simple XOR-based "encryption" for demonstration purposes.
// This is NOT cryptographically secure, but simulates at-rest encryption.
const encode = (str: string): string => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
        result += String.fromCharCode(charCode);
    }
    return btoa(result);
};

const decode = (encodedStr: string): string => {
    try {
        const decodedB64 = atob(encodedStr);
        let result = '';
        for (let i = 0; i < decodedB64.length; i++) {
            const charCode = decodedB64.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    } catch (e) {
        console.error("Failed to decode data, returning as is.", e);
        return encodedStr; // Gracefully fail if data is not encoded
    }
};


const initialUser: StoredUser = {
    fullName: "Alex Doe",
    username: "alexd",
    age: 32,
    email: "alex.doe@example.com",
    bio: "Legal tech enthusiast exploring the intersection of AI and law.",
    password: "password123",
    savedDocuments: [],
    role: "owner",
    plan: "pro",
    credits: 999
};

const getUsers = (): Record<string, StoredUser> => {
    try {
        const encryptedUsers = localStorage.getItem(DB_KEY);
        if (!encryptedUsers) return {};
        
        const decryptedJson = decode(encryptedUsers);
        return JSON.parse(decryptedJson);
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        // Attempt to read as plaintext for migration
        try {
            const usersJson = localStorage.getItem(DB_KEY);
            return usersJson ? JSON.parse(usersJson) : {};
        } catch (e) {
            return {};
        }
    }
};

const saveUsers = (users: Record<string, StoredUser>): void => {
    const usersJson = JSON.stringify(users);
    const encryptedUsers = encode(usersJson);
    localStorage.setItem(DB_KEY, encryptedUsers);
};

export const initializeDB = (): void => {
    const users = getUsers();
    if (Object.keys(users).length === 0) {
        saveUsers({ [initialUser.email.toLowerCase()]: initialUser });
    }
};

export const getUserByEmail = (email: string): StoredUser | null => {
    const users = getUsers();
    return users[email.toLowerCase()] || null;
};

export const createUser = (user: Omit<StoredUser, 'savedDocuments' | 'workspacePassword' | 'workspaceHint'>): StoredUser => {
    const users = getUsers();
    const newUser: StoredUser = {
        ...user,
        savedDocuments: [],
    };
    users[user.email.toLowerCase()] = newUser;
    saveUsers(users);
    return newUser;
};

export const updateUser = (updatedUser: User | StoredUser): StoredUser | null => {
    const users = getUsers();
    const lowerCaseEmail = updatedUser.email.toLowerCase();
    const existingUser = users[lowerCaseEmail];
    if (existingUser) {
        const newUserState = { ...existingUser, ...updatedUser };
        users[lowerCaseEmail] = newUserState;
        saveUsers(users);
        return newUserState;
    }
    return null;
};

export const saveDocumentToWorkspace = (email: string, document: SavedDocument): StoredUser | null => {
    const users = getUsers();
    const lowerCaseEmail = email.toLowerCase();
    const existingUser = users[lowerCaseEmail];
    if (existingUser) {
        const existingDocuments = existingUser.savedDocuments || [];
        const docIndex = existingDocuments.findIndex(doc => doc.fileName === document.fileName && doc.summary.title === document.summary.title);

        let updatedDocuments;
        if (docIndex > -1) {
            // Update existing document
            updatedDocuments = [...existingDocuments];
            updatedDocuments[docIndex] = document;
        } else {
            // Add new document
            updatedDocuments = [...existingDocuments, document];
        }

        const updatedUser = { ...existingUser, savedDocuments: updatedDocuments };
        users[lowerCaseEmail] = updatedUser;
        saveUsers(users);
        return updatedUser;
    }
    return null;
}

export const getSavedDocuments = (email: string): SavedDocument[] => {
    const user = getUserByEmail(email);
    return user?.savedDocuments || [];
};
