import { useContext, useEffect } from "react";
import { Context } from "../../main";
import { MatchList } from "./MatchList/MatchList";

export const MatchPage = () => {
    const { matchStore, predictionStore } = useContext(Context);

    useEffect(() => {
        matchStore.getUpcoming();
        // нужны, чтобы отметить матчи, на которые прогноз уже сделан
        predictionStore.getMyPredictions();
    }, [matchStore, predictionStore]);

    return (
        <div className='page'>
            <div className='page-header'>
                <div>
                    <h1 className='page-title'>Ближайшие матчи</h1>
                    <p className='page-subtitle'>Выберите исход матча — за верный прогноз начисляется 10 очков</p>
                </div>
            </div>
            <MatchList />
        </div>
    )
}
