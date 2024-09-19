const router = require('express').Router();
const controllerSpaceManager = require('../controllers/spacemanager.controller.js');
const controllerSponser = require('../controllers/sponser.controller.js');
const controllerSponserShip = require('../controllers/sponsership.controller.js');
const controllerMaterials = require('../controllers/materials.controller.js');
const controllerTrack = require('../controllers/track.controller.js');
const controllerSpace = require('../controllers/space.controller.js');
const controllerScheduleTrack = require('../controllers/schedule_track.controller.js');
const controllerTypeTrack = require('../controllers/type_track.controller');

const path = require('path')

const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");

router.get('/', function(req, res) {  //rota express....
    res.send(path.resolve(__dirname + '/../../Front-end-gestor-espaco/'))
 
    //res.send("PW");
    //res.end();
 });

router.get('/spacemanager/', controllerSpaceManager.read);
router.get('/spacemanager/inf/:email', controllerSpaceManager.readInfo);
router.get('/spacemanager/:email', controllerSpaceManager.readEmail);
router.put('/spacemanager/:id', controllerSpaceManager.update);
router.post('/spacemanager/', controllerSpaceManager.save);

router.get('/sponser/', controllerSponser.read);
router.get('/sponser/:id', controllerSponser.readID);
router.get('/sponser/readIDnome/:nome', controllerSponser.readIDnome);
router.post('/sponser/', controllerSponser.save);
router.put('/sponser/:id', controllerSponser.update);
router.put('/sponser/del/:id', controllerSponser.deleteLogico);

router.get('/sponsership/', controllerSponserShip.read);
router.get('/sponsership/:id', controllerSponserShip.readID);
router.get('/sponsership/info/:id', controllerSponserShip.readInfo);
router.get('/sponsershipreadAll/', controllerSponserShip.readAll);
router.post('/sponsership/', controllerSponserShip.save);
router.put('/sponsership/del/:id', controllerSponserShip.deleteLogico);
router.put('/sponsership/:id', controllerSponserShip.update);


router.get('/materials/', controllerMaterials.read);
router.get('/materials/:id', controllerMaterials.readID);
router.get('/materialsall/', controllerMaterials.readAll);
router.post('/materials/', controllerMaterials.save);
router.put('/materials/:id', controllerMaterials.update);
router.put('/materials/del/:id',controllerMaterials.deleteLogico);



router.get('/track/', controllerTrack.read);
router.post('/track/', controllerTrack.save);
router.get('/track/:id', controllerTrack.readID);
router.get('/trackreadAll/', controllerTrack.readAll);
router.put('/track/del/:id', controllerTrack.deleteLogico);
router.put('/track/:id', controllerTrack.update);

router.get('/space/', controllerSpace.read );
router.get('/space/:id', controllerSpace.readID);
router.get('/space/get/:local', controllerSpace.readIDEspaco);
router.get('/space/info/:local', controllerSpace.readLocal);
router.post('/space/', controllerSpace.save );
router.put('/space/:id', controllerSpace.update);
router.put('/space/del/:id', controllerSpace.deleteLogico);


router.get('/schedule_track/' , controllerScheduleTrack.read);
router.get('/schedule_track/:id' , controllerScheduleTrack.readID);
router.post('/schedule_track', controllerScheduleTrack.save);
router.put('/schedule_track/del/:id', controllerScheduleTrack.deleteLogico);

router.get('/type_track/' , controllerTypeTrack.read);
router.get('/type_track/:id' , controllerTypeTrack.readID);
router.post('/type_track', controllerTypeTrack.save);
router.put('/type_track/del/:id', controllerTypeTrack.deleteLogico);


module.exports = router;

