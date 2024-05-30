// utils/formatDate.js
export const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) {
        return ''; // Return empty string if dateString is undefined or not a valid date
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
