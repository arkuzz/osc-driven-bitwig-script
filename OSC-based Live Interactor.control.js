loadAPI(19);

host.setShouldFailOnDeprecatedUse(true);
host.defineController("OSC", "Grassphonic Live Interactor", "0.1", "7b0dec63-840c-4a22-b710-2936d4a0aed6", "briangrassfield");
var trackCount = 0;
var trackBank;
var tracks = [];
var masterTrack;
var actualTrackCount = 0;
var trackBankLength;
var target;
var scenesToLaunch = [];
var sceneMapping = [0, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var sceneMappedCount = 0;
var transport;

function init() {

   println("Initializing OSC-based Live Interactor");

   transport = host.createTransport();
   println("Transport created");
   sceneBank = host.createSceneBank(128);
   println("Scene bank created");
   userControlBank = host.createUserControls(16);
   println("User control bank created");

   transport = host.createTransport();
   transport.isPlaying().markInterested();
   transport.isPlaying().addValueObserver(function (isPlaying) {
      ledSwitch(target, "/led/playing", isPlaying);
   });

   trackBank = host.createMainTrackBank(16, 0, 0); 

   var osc = host.getOscModule();
  
   var targetHost = "192.168.64.36";
   var sendPort = 9100;
   var receivePort = 8100;
   
   // Add the OSC target
   target = osc.connectToUdpServer(targetHost, sendPort, osc.createAddressSpace());

   ledSwitch(target, "/led/online", true);
   setPage(0);
   
   var sceneIndex = 0;
   for (let i = 0; i < 128; i++) {
      let scene = sceneBank.getScene(i);
      scene.exists().markInterested();
      scene.name().markInterested();
      scene.exists().addValueObserver(function (exist) {
         if(sceneMapping.includes(i) && exist) {
            scenesToLaunch[sceneIndex] = scene;
            sceneIndex++;
            sceneMappedCount++;
            println("Scene " + scenesToLaunch);
         }
      });
   }

   trackBank.itemCount().markInterested();
   trackBank.itemCount().addValueObserver(function(count) {
      trackBankLength = count;
   });
   
   for(let i = 0; i < 16; i++) {
      let track = trackBank.getItemAt(i);
      let itemIndex = i + 1;
      tracks[i] = track;
      track.exists().markInterested();
      track.name().markInterested();
      track.name().addValueObserver(function(name) {
         refreshInterface(target);
      });
      track.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track" + itemIndex, !isMuted);
      });
   
   }

   masterTrack = host.createMasterTrack(0);
      
   println("Creating address space");
   var receiveSpace = osc.createAddressSpace();
   receiveSpace.setShouldLogMessages(true);

   println("Registering sync receiver method");
   receiveSpace.registerMethod("/controls/sync", ",f", "Sync function", function (source, message)
   {
      refreshInterface(target, trackBank);
   });

   receiveSpace.registerMethod("/controls/stop", ",f", "Stop function", function (source, message)
   {
      transport.stop();
   });

   println("Registering scene launching receiver method");
   for (let i = 0; i < 16; i++) {
      let index = i + 1;
      receiveSpace.registerMethod("/controls/scene" + index, ",f", "Launch scene " + index, function (source, message)
      {
         launchScene(i);
      }
      );
   }
  
   receiveSpace.registerDefaultMethod (function (source, message)
   {
      println("Received: " + message.getAddressPattern());
   });

   println("Create OSC server");
   osc.createUdpServer(receivePort, receiveSpace);

   refreshInterface(target);
   
   println("OSC-based Live Interactor initialized!");
}

function refreshInterface(target)
{
   ledSwitch(target, "/led/online", true);
   
   for (let i = 0; i < 16; i++) {
      let track = tracks[i];
      let index = i + 1;
      ledSwitch(target, "/led/track" + index, !track.mute().get());
      setLabel(target, "/labels/track" + index, track.name().get());
      println("Track " + index + " name: " + track.name().get());
   }

   for (let i = 0; i < 16; i++) {
      if(i < sceneMappedCount)
         sceneExists(scenesToLaunch[i], i);
      else
         sceneUnavailable(i);
   }
   

   host.scheduleTask(function() {
      //println("Actual track count: " + actualTrackCount);
      println("Actual track count: " + trackBankLength);

      if(trackBankLength < 16)
      {
         println("Track bank size is less than 16, exiting...");
         ledSwitch(target, "/led/checked", false);
         return;
      }
      

      ledSwitch(target, "/led/checked", true);

      // TODO: Perform further initialization here.
      
   }, 20);
}

function ledSwitch(target, address, status)
{
   target.sendMessage(address, status);
}

function setLabel(target, address, label)
{
   target.sendMessage(address, label);
}

function setPage(page)
{
   println("Pager to send: " + page);
   target.sendMessage("/interface/pages", page);
}

function sceneExists(scene, index) {
   println("Scene to send: " + scene);
   setLabel(target, "/labels/scene" + (index+1), scene.name().get());
}

function sceneUnavailable(index) {
   println("Scene unavailable: " + index);
   setLabel(target, "/labels/scene" + (index+1), "-");
}

function launchScene(index) {
   if(index >= sceneMappedCount)
      return
   let scene = scenesToLaunch[index];
   setPage(index);
   scene.launch();
}


function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}