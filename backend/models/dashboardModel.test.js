jest.mock("../db", () => ({
    query: jest.fn()
}));

const pool = require("../db");
const { getDashboardData } = require("./dashboardModel");

describe("getDashboardData", () => {
    test("gets all dashboard counts with one query", async () => {
        pool.query.mockResolvedValue({
            rows: [{
                total_inspection: "12",
                completed_inspection: "8",
                pending_inspection: "3",
                total_defects: "7",
                completed_defects: "4",
                pending_defects: "2",
                low_severity: "1",
                medium_severity: "3",
                high_severity: "3"
            }]
        });

        await expect(getDashboardData()).resolves.toEqual({
            totalInspection: 12,
            completedInspection: 8,
            pendingInspection: 3,
            totalDefects: 7,
            completedDefects: 4,
            pendingDefects: 2,
            lowSeverity: 1,
            mediumSeverity: 3,
            highSeverity: 3
        });
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query.mock.calls[0][0]).toContain("COUNT(*) FILTER");
    });
});
