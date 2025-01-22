// Utility functions for Profile components

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const formatUserName = (name: string): string => {
    return name.trim().replace(/\s+/g, " ");
  };
  
  export const hashPassword = async (password: string): Promise<string> => {
    // Simulate hashing for example purposes
    const hashedPassword = btoa(password); // Replace with real hashing logic if needed
    return Promise.resolve(hashedPassword);
  };
  
  export const isPasswordStrong = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  export const generateAvatarUrl = (email: string): string => {
    const baseUrl = "https://www.gravatar.com/avatar/";
    const emailHash = btoa(email.trim().toLowerCase()); // Replace with real MD5 hashing if needed
    return `${baseUrl}${emailHash}`;
  };
  