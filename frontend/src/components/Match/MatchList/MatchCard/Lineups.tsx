import { useState } from "react";
import type { IMatchTeam } from "../../../../models/ITeam";

type LineupsProps = {
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
};

export const Lineups = ({ homeTeam, awayTeam }: LineupsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (homeTeam.players.length === 0 && awayTeam.players.length === 0) {
        return null;
    }

    return (
        <div className='lineups'>
            <button type='button' className='lineups-toggle' aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
                Составы команд
                <span className={`lineups-arrow ${isOpen ? 'is-open' : ''}`} aria-hidden='true'>▾</span>
            </button>
            {
                isOpen && (
                    <div className='lineups-grid'>
                        {
                            [homeTeam, awayTeam].map(team => (
                                <div key={team.name}>
                                    <div className='lineups-team'>{team.name}</div>
                                    {
                                        team.players.length === 0
                                            ? <p className='lineups-empty'>Состав неизвестен</p>
                                            : (
                                                <ul className='lineups-list'>
                                                    {
                                                        team.players.map(player => (
                                                            <li key={player.id}>
                                                                <span>{player.firstName} {player.lastName}</span>
                                                                {player.position && <span className='lineups-position'>{player.position}</span>}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            )
                                    }
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}
