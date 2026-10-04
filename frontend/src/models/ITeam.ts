export interface IPlayer {
    id: string;
    apiId: string;
    firstName: string;
    lastName: string;
    age: number | null;
    nationality: string | null;
    position: string | null;
    photo: string | null;
    teamId: string;
}

export interface ITeam {
    id: string;
    name: string;
    country: string | null;
    logo: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IMatchTeam {
    name: string;
    country: string | null;
    logo: string | null;
    players: IPlayer[];
}
