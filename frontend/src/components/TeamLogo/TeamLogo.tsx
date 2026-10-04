import { useState } from "react";
import { getInitials } from "../../utils/format";
import './team-logo.css';

type TeamLogoProps = {
    name: string;
    logo: string | null;
    size?: 'sm' | 'md';
};

export const TeamLogo = ({ name, logo, size = 'md' }: TeamLogoProps) => {
    const [failed, setFailed] = useState(false);

    if (!logo || failed) {
        return (
            <span className={`team-logo team-logo--${size} team-logo--placeholder`} aria-hidden='true'>
                {getInitials(name)}
            </span>
        );
    }

    return (
        <img className={`team-logo team-logo--${size}`} src={logo} alt='' onError={() => setFailed(true)} />
    )
}
