export function calculateMarketingMetrics(input: {
  dailyMessagesSent: number;
  monthlyMessagesSent: number;
  successfulReplies: number;
  failedReplies: number;
  completedFollowUps: number;
  pendingFollowUps: number;
  dailyTarget: number;
  monthlyTarget: number;
}) {
  const totalReplies = input.successfulReplies + input.failedReplies;
  const totalFollowUps = input.completedFollowUps + input.pendingFollowUps;
  const successRate = totalReplies === 0 ? 0 : (input.successfulReplies / totalReplies) * 100;
  const completionPercentage =
    totalFollowUps === 0 ? 0 : (input.completedFollowUps / totalFollowUps) * 100;
  const dailyProductivity = Math.min((input.dailyMessagesSent / input.dailyTarget) * 100, 120);
  const monthlyProductivity = Math.min((input.monthlyMessagesSent / input.monthlyTarget) * 100, 120);
  const productivity = dailyProductivity * 0.6 + monthlyProductivity * 0.4;
  const performanceScore = successRate * 0.35 + completionPercentage * 0.25 + productivity * 0.4;

  return {
    successRate: Number(successRate.toFixed(1)),
    productivity: Number(productivity.toFixed(1)),
    completionPercentage: Number(completionPercentage.toFixed(1)),
    performanceScore: Number(Math.min(performanceScore, 100).toFixed(1))
  };
}
