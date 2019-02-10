import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';
import * as config from 'config';
import * as mongoose from 'mongoose';

import { Router } from '../routes/router'


class App {

    public app: express.Application;
    public authCheck = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${config.get('Secret.domain')}/.well-known/jwks.json`
        }),
        audience: config.get('Secret.audience'),
        issuer: config.get('Secret.domain'),
        algorithms: config.get('Secret.algorithms')
    });
    public router : Router = new Router();

    constructor(){
        this.app = express();
        this.conf();
        this.router.routes(this.app);
        this.dbConnect();
    }

    private conf(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors());
    }

    private dbConnect(): void{
        mongoose.connect('mongodb://localhost/sampledb', { useNewUrlParser: true });
        const connectionStatus = mongoose.connection;
        connectionStatus.on('connected', ()=>{
            console.log('successful connection to mongodb');
        });
    }
}
export default new App().app;