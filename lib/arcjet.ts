import "server-only";


import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
} from '@arcjet/next'
import { env } from './env';

export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    slidingWindow
};

export const arcjetInstance = arcjet({
    key: env.ARCJET_KEY,
    characteristics: ["fingerprint"],

    // Définissez la règle de base ici, peut également être vide si vous ne souhaitez pas avoir de règle de base
    rules : [
        shield({
            mode: 'LIVE',
        })
    ]
})