import type { IMatchTeam } from "../../../../models/ITeam";
import { TeamLogo } from "../../../TeamLogo/TeamLogo";

type TeamInfoProps = {
    team: IMatchTeam;
    side: 'home' | 'away';
};

export const TeamInfo = ({ team, side }: TeamInfoProps) => {
    return (
        <div className={`team-info team-info--${side}`}>
            <TeamLogo name={team.name} logo={team.logo} />
            <span className='team-info-name'>{team.name}</span>
            <span className='team-info-meta'>
                {side === 'home' ? 'Хозяева' : 'Гости'}
                {team.country && ` · ${team.country}`}
            </span>
        </div>
    )
}
