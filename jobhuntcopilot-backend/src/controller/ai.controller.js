// simulated interfaces 
export const getScore = (req, res) => {
    res.json({
      score: 0.82,
      matched: ["react"],
      missing: ["aws"]
    });
  };
  
export const getCoverLetter = (req, res) => {
    res.json({
      text: "Dear Hiring Manager, I am excited to apply for this position..."
    });
};