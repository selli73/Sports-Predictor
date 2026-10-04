import { useContext, useEffect } from "react";
import { Context } from "../../main";
import { PredictionStats } from "./PredictionStats";
import { PredictionList } from "./PredictionList/PredictionList";
import './prediction-page.css';

export const PredictionPage = () => {
    const { predictionStore } = useContext(Context);

    useEffect(() => {
        predictionStore.getMyPredictions();
    }, [predictionStore]);

    return (
        <div className='page'>
            <div className='page-header'>
                <div>
                    <h1 className='page-title'>Мои прогнозы</h1>
                    <p className='page-subtitle'>Очки начисляются автоматически после завершения матча</p>
                </div>
            </div>
            <PredictionStats />
            <PredictionList />
        </div>
    )
}
