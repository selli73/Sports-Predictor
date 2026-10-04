import AdminService from "../services/AdminService";

export default class AdminStore {
    async importUpcomingMatches() {
        const response = await AdminService.importUpcomingMatches();
        return response.data;
    }

    async importFinishedMatches() {
        const response = await AdminService.importFinishedMatches();
        return response.data;
    }

    async calculateAiProbability() {
        const response = await AdminService.calculateAiProbability();
        return response.data;
    }

    async addPoints() {
        const response = await AdminService.addPoints();
        return response.data;
    }
}
