import { Request, Response, NextFunction, response } from 'express';
import axios from 'axios';
import { WEATHER_API_KEY } from '../../config';

const WEATHER_ROOT = 'https://api.weather.com/v1';

export default async (req: Request, res: Response, next: NextFunction) => {
    const lat = req.params.latitude;
    const long = req.params.longitude;
    const units = req.query.units || 'h';
    const language = req.query.language || 'en-US';

    try {
        const forecast = (await axios(`${WEATHER_ROOT}/geocode/${lat}/${long}/forecast/daily/7day.json?language=${language}&units=${units}&apiKey=${WEATHER_API_KEY}`)).data;
        const current = (await axios(`${WEATHER_ROOT}/geocode/${lat}/${long}/observations.json?language=${language}&units=${units}&apiKey=${WEATHER_API_KEY}`)).data;

        console.log(current);

        const conditionsData = {
            metadata: current.metadata,
            observation: {
                
            }
        }

        res.json({
            fcstdaily7: {
                errors: false,
                data: forecast
            },
            conditions: {
                errors: false,
                data: conditionsData
            },
            metadata: {
                version: 2,
                transaction_id: new Date().getTime() / 1000
            }
        })
    } catch (err) {
        if (err.response) {
            return res.sendStatus(err.response.status);
        } else {
            next(err);
        }
    }
};