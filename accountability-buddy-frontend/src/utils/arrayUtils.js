import React from 'react';
import { removeDuplicates, sortByKey, filterByKeyValue, findByKeyValue } from './utils/arrayUtils';

const ArrayUtilExample = () => {
  const data = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 30 },
    { id: 1, name: 'Alice', age: 30 }, // Duplicate
  ];

  // Remove duplicates
  const uniqueData = removeDuplicates(data.map(item => item.id));
  
  // Sort by age
  const sortedData = sortByKey(data, 'age');

  // Filter by age
  const filteredData = filterByKeyValue(data, 'age', 30);

  // Find by name
  const foundItem = findByKeyValue(data, 'name', 'Bob');

  return (
    <div>
      <h1>Array Utility Examples</h1>
      <h2>Unique IDs:</h2>
      <pre>{JSON.stringify(uniqueData, null, 2)}</pre>

      <h2>Sorted Data by Age:</h2>
      <pre>{JSON.stringify(sortedData, null, 2)}</pre>

      <h2>Filtered Data (Age 30):</h2>
      <pre>{JSON.stringify(filteredData, null, 2)}</pre>

      <h2>Found Item (Name 'Bob'):</h2>
      <pre>{JSON.stringify(foundItem, null, 2)}</pre>
    </div>
  );
};

export default ArrayUtilExample;
