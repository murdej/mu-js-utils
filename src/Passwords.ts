export class Passwords
{
    public static computeScore(password: string): number
    {
        const groupCounts: Record<string, number> = {
            '09': 10,
            'az': 26,
            'AZ': 26,
            other: 161,
        };
        // const mixBonus = 3;
        let score = 0;
        const usedGroups: Set<string> = new Set();
        for (let i = 0; i < password.length; i++) {
            const ch = password.charAt(i);
            for (const range in groupCounts) {
                if ((ch <= range.charAt(1) && ch >= range.charAt(0)) || range === 'other') {
                    score += groupCounts[range]!;
                    usedGroups.add(range);
                    break;
                }
            }
        }

        for (const group of usedGroups) {
            score += password.length * groupCounts[group];
        }

        return score;
    }
}