// Test script for career recommendations endpoint
const testData = {
  iqScore: 120,
  interests: "programming, artificial intelligence",
  academicDetails: "Computer Science Engineering",
  hobbies: "coding, reading tech blogs",
  location: "India",
  personality: {
    introvertExtrovert: "introvert",
    creativity: "high",
    leadership: "medium"
  }
};

console.log("Testing career recommendations endpoint...");
console.log("Test data:", JSON.stringify(testData, null, 2));

fetch('http://localhost:5001/api/career-recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log("Response status:", response.status);
  return response.json();
})
.then(data => {
  console.log("Response data:", JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error("Error:", error);
});
