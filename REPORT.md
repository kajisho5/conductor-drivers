# 変換の結果

作成：2026-10-17T01:47:59.002Z

| 結果 | 数 | 意味 |
|---|---|---|
| full | 84 | 全部の動作を送れる |
| partial | 195 | 一部の動作を送れる |
| list-only | 39 | 動作の一覧は取れたが、送る内容を作れなかった |
| no-send | 261 | 動作を実行しても何も送らなかった（返事待ち・独自の接続手順など） |
| failed / crashed | 16 | モジュールが起動しなかった |
| license | 2 | ライセンスが再利用を許していないので除外 |
| builtin | 3 | アプリに組み込みの定義がある |
| 合計 | 600 | |

送れる動作：3533 / 8357

## 送れなかった理由（動作の数）

- no-send: 723
- error: 217
- overlap: 190
- text-slot: 181
- not-run: 161
- number-slot: 115
- verify-mismatch: 66
- too-many-choices: 64
- option-breaks-send: 45
- osc-no-send: 39
- verify-no-send: 33
- verify-path: 31
- parts-origin-differs: 27
- two-options-one-arg: 18
- verify-multi-request: 16
- path-overlap: 14
- map-twice: 12
- body-number-slot: 12
- verify-body: 10
- part0-osc-string-overlap: 9
- part0-osc-address-overlap: 9
- osc-address-text-slot: 9
- osc-multi-datagram: 8
- verify-osc-float: 8
- path-number-slot: 8
- part0-verify-osc-address: 7
- mixed: 7
- body-text-slot: 6
- verify-osc-int: 6
- osc-string-number-slot: 6
- osc-address-overlap: 5
- multi-request: 5
- osc-arg-count: 4
- part0-option-breaks-send: 4
- part0-verify-multi-request: 3
- body-overlap: 3
- multi-datagram: 3
- path-text-slot: 3
- part0-too-many-choices: 2
- parts-map-differs: 2
- part0-osc-address-too-many-choices: 2
- part0-number-slot: 2
- osc-string-text-slot: 2
- part0-overlap: 2
- part0-osc-multi-datagram: 1
- osc-type-text-slot: 1
- map-in-path-and-body: 1
- part0-osc-no-send: 1
- osc-string-overlap: 1
- part0-verify-osc-int: 1
- part1-path-number-slot: 1
- part1-path-text-slot: 1
- part0-path-text-slot: 1
- verify-osc-address: 1
- part0-map-twice: 1
- osc-number: 1
- origin-differs: 1
- part0-body-number-slot: 1
- part1-verify-osc-int: 1
- part0-path-too-many-choices: 1
- origin-varies: 1

## 機器ごと

| モジュール | 名前 | 結果 | 送れる / 全部 | ライセンス |
|---|---|---|---|---|
| PosiStageNet-protocol | PosiStageNet Protocol | no-send | 0 / 2 | MIT |
| ableton-osc | Ableton Live | partial | 6 / 28 | MIT |
| adder-avm | Adder AVM | full | 3 / 3 | MIT |
| adder-infinity-aim | Adder AIM | full | 5 / 5 | MIT |
| adder-infinity-alif | Adder ALIF | full | 3 / 3 | MIT |
| adder-infinity100xseries | Adder Infinity 1000R Series / Infinity 2020R Series | list-only | 0 / 1 | MIT |
| adder-xdip | Adder XDIP | failed | 0 / 5 | MIT |
| adlerluiz-ytmdesktop | adlerluiz YouTube Music Desktop | no-send | 0 / 0 | MIT |
| aetaaudio-codecs | AETA HIFISCOOP 3 / SCOOP 3 / SCOOP 4+ / SCOOPY+ / Scoop5 S / Scoop5 S-IP / Sc… | partial | 51 / 58 | MIT |
| agf-characterworks | AGF Characterworks | partial | 2 / 3 | MIT |
| aimedia-encoder-captions | AI Media AV 610 / HD 1492 / HD 492 | no-send | 0 / 0 | MIT |
| aimedia-icap | AI Media iCap Portal | no-send | 0 / 1 | MIT |
| aimedia-lexilive | AI Media Lexi Live | no-send | 0 / 4 | MIT |
| aja-dante-12gam | AJA DANTE 12GAM | no-send | 0 / 1 | MIT |
| aja-fs | AJA FS2 / FS4 / FS-HDR | full | 2 / 2 | MIT |
| aja-helo | AJA HELO | partial | 12 / 17 | MIT |
| aja-kipro | AJA Ki Pro / Ki Pro Ultra | partial | 20 / 21 | MIT |
| aja-kumo | AJA Kumo | partial | 4 / 5 | MIT |
| allenheath-ahm | Allen & Heath AHM | partial | 2 / 14 | MIT |
| allenheath-avantis | Allen & Heath Avantis | partial | 17 / 40 | MIT |
| allenheath-cq | Allen Heath CQ-12T / CQ-18T / CQ-20B | partial | 1 / 9 | MIT |
| allenheath-dlive-ilive | Allen & Heath dLive / ilive | no-send | 0 / 22 | MIT |
| allenheath-dlive | Allen & Heath dLive | partial | 8 / 21 | MIT |
| allenheath-sq | Allen & Heath SQ5 / SQ6 / SQ7 | partial | 11 / 45 | MIT |
| analogway-awj | Analog Way AWJ Protocol Device / LivePremier / Alta 4K / Midra 4K | no-send | 0 / 0 | MIT |
| analogway-coreplay | Analog Way CorePlay Solo | partial | 5 / 8 | MIT |
| analogway-livecore | Analog Way LiveCore series | partial | 6 / 13 | MIT |
| analogway-livepremier | Analog Way Aquilon | partial | 10 / 14 | MIT |
| analogway-midra | Analog Way Midra / Eikos2 / Saphyr / Pulse2 / SmartMatriX2 / QuickMatriX / Qu… | partial | 12 / 14 | MIT |
| analogway-picturall | Analog Way Picturall Media Server | no-send | 0 / 9 | ISC |
| analogway-pls300 | Analog Way PLS 300 | partial | 4 / 5 | MIT |
| android-tv | Google androidtv | no-send | 0 / 7 | MIT |
| anomes-millumin | Anomes Millumin 2 / Millumin 3 / Millumin 4 | partial | 40 / 41 | MIT |
| apc-rackpdu | APC Rack PDU | failed | 0 / 5 | MIT |
| apc-ups | APC UPS | no-send | 0 / 0 | MIT |
| arkaos-mediamaster | ArKaos MediaMaster Remote Player | no-send | 0 / 1 | MIT |
| arri-tally | Arri Alexa / Amira | full | 1 / 1 | MIT |
| aten-matrix | ATEN Matrix | full | 2 / 2 | MIT |
| atlasied-atmosphere | AtlasIED Atmosphere | partial | 15 / 24 | MIT |
| attend2it-speakertimer | Attend2IT Speakertimer.co.uk | no-send | 0 / 10 | MIT |
| audac-mtx | Audac MTX48/88 | partial | 9 / 11 | MIT |
| audinate-dante-ddm | Audinate Dante | no-send | 0 / 0 | MIT |
| audinate-dantecontroller | Audinate Dante Controller | no-send | 0 / 0 | MIT |
| audiostrom-liveprofessor | Audioström LiveProfessor | no-send | 0 / 17 | MIT |
| audiotechnica-ceilingarray | Audio Technica ATND-1061 | no-send | 0 / 15 | MIT |
| audiotechnica-digitalmixer | Audio Technica ATDM-0604 / ATDM-0604a / ATDM-1012 | no-send | 0 / 18 | MIT |
| audiotechnica-discussionsystem | Audio Technica AT-UC50 / AT-UCIR | no-send | 0 / 25 | MIT |
| audiotechnica-esw | Audio Technica Engineered Sound Wireless / ESW | no-send | 0 / 9 | MIT |
| audiotechnica-system20 | Audio Technica System 20 PRO | list-only | 0 / 19 | MIT |
| audivero-unityintercom-client | Audivero Unity Intercom Client | no-send | 0 / 7 | MIT |
| auri-tx2n | Auri TX2N / TX2N-D / D4 / D16 | list-only | 0 / 7 | MIT |
| autodirector-mirusuite | AutoDirector MiruSuite | no-send | 0 / 0 | MIT |
| aver-ptz | Aver PTZ | partial | 32 / 39 | MIT |
| avgear-ip410 | AVGear IP410 | no-send | 0 / 4 | MIT |
| avmediatools-protimer | AVMediatools ProTimer | partial | 14 / 15 | MIT |
| avocet-landscape | Avocet RT Ltd StreamDeck Interface | failed | 0 / 2 | MIT |
| avolites-titan | Avolites Titan | failed | 0 / 0 | MIT |
| avstumpfl-pixera | AVStumpfl Pixera | partial | 16 / 53 | MIT |
| aws-ec2 | AWS EC2 | list-only | 0 / 1 | MIT |
| aws-elementallive | AWS Elemental Live | partial | 7 / 8 | MIT |
| aws-medialive | AWS Elemental MediaLive | no-send | 0 / 3 | MIT |
| axeltechnology-cgplus | AxelTech CG Plus | no-send | 0 / 12 | MIT |
| axeltechnology-vjpro | AxelTech VJ Pro | no-send | 0 / 8 | MIT |
| axeltechnology-xplayout | AxelTech XPlayout | list-only | 0 / 24 | MIT |
| axeltechnology-xradio | AxelTech XRadio | full | 7 / 7 | MIT |
| axeltechnology-youplay | AxelTech YouPlay | no-send | 0 / 22 | MIT |
| aximmetry-composer | Aximmetry Composer | full | 4 / 4 | MIT |
| axis-ptz | axis PTZ Camera | partial | 15 / 22 | MIT |
| ballscore-broadcast | Ball Score Broadcast | no-send | 0 / 0 | MIT |
| barco-clickshare | Barco Clickshare | full | 1 / 1 | MIT |
| barco-dp | Barco DP Projector | partial | 5 / 6 | MIT |
| barco-eventmaster-xml | Barco Event Master xml | partial | 2 / 3 | MIT |
| barco-eventmaster | Barco Event Master | no-send | 0 / 0 | MIT |
| barco-pds | Barco PDS | partial | 12 / 14 | MIT |
| barco-pulse | Barco UDX Pulse Projector | partial | 10 / 22 | MIT |
| baserow-baserow | Baserow | list-only | 0 / 1 | MIT |
| bbc-raven | BBC Raven | full | 37 / 37 | MIT |
| beaware-conferencecaptioning | BeAware ConferenceCaptioning | partial | 1 / 6 | MIT |
| behringer-wing | Behringer WING | partial | 16 / 98 | MIT |
| behringer-x32 | Behringer/Midas X32/M32 | failed | 0 / 0 | MIT |
| behringer-xair | Behringer/Midas XR/MR / XAir / XR12 / XR16 / X18 / XR18 | partial | 36 / 84 | MIT |
| betr-support | Betr Production Betr Support | full | 1 / 1 | MIT |
| biamp-audia | Biamp Audia / Nexia | no-send | 0 / 6 | MIT |
| biamp-tesira | Biamp TesiraFORTE | partial | 2 / 10 | MIT |
| binary-moipcontroller | Binary B-900-MOIP-4K-CTRL | full | 10 / 10 | MIT |
| binwiederhier-ntfy | Philipp C. Heckel Ntfy | failed | 0 / 3 | MIT |
| birddog-central | BirdDog Central | no-send | 0 / 0 | MIT |
| birddog-cloud | BirdDog Cloud | no-send | 0 / 0 | MIT |
| birddog-connect | BirdDog Connect | no-send | 0 / 0 | MIT |
| birddog-converters | BirdDog Converters | no-send | 0 / 0 | MIT |
| birddog-ptz | BirdDog PTZ | no-send | 0 / 0 | MIT |
| bitfocus-cloud | Bitfocus Companion Cloud | no-send | 0 / 2 | MIT |
| bitfocusas-listener | Bitfocus Listener | no-send | 0 / 14 | MIT |
| blackbox-boxilla | Blackbox Boxilla | full | 1 / 1 | MIT |
| bmd-atem | Blackmagic Design ATEM | builtin | 0 / 47 | MIT |
| bmd-gpi-and-tally-interface | Blackmagic Design GPI and Tally Interface | partial | 1 / 3 | MIT |
| bmd-hyperdeck | Blackmagic Design Hyperdeck | no-send | 0 / 24 | MIT |
| bmd-multiview4 | Blackmagic Design Multiview 4 | full | 10 / 10 | MIT |
| bmd-smartview | Blackmagic Design SmartView / SmartScope | no-send | 0 / 11 | MIT |
| bmd-teranex | Blackmagic Design Teranex | partial | 91 / 104 | MIT |
| bmd-ultimatte | Blackmagic Design Ultimatte | partial | 29 / 30 | MIT |
| bmd-videohub | Blackmagic Design Videohub | partial | 5 / 18 | MIT |
| bmd-webpresenter | Blackmagic Design WebPresenter HD / WebPresenter 4K | full | 9 / 9 | MIT |
| boinx-mimolive | Boinx mimoLive | partial | 1 / 7 | MIT |
| bolin-ptz | Bolin Technology PTZ | no-send | 0 / 8 | MIT |
| bom-api | Bureau of Meteorology API | no-send | 0 / 0 | MIT |
| borealis-vor | Borealis Solutions Vor | full | 12 / 12 | MIT |
| bosch-dicentis | Bosch Dicentis Conference System | no-send | 0 / 0 | MIT |
| bosch-hd-cameracontrol | Bosch HD Camera Control | no-send | 0 / 0 | MIT |
| boxcast-api | Boxcast API | partial | 2 / 8 | MIT |
| brainstorm-suite | Brainstorm Multimedia Brainstorm Suite | list-only | 0 / 7 | MIT |
| broadlink-remote | BroadLink RM4 Pro | no-send | 0 / 2 | MIT |
| brompton-tessera | Brompton Technology Tessera LED Processor Control | partial | 22 / 55 | MIT |
| bss-soundweb | BSS Soundweb London | no-send | 0 / 4 | MIT |
| bytehive-playoutbee | ByteHive PlayoutBee | partial | 9 / 11 | ISC |
| cablematters-matrix | Cable Matters Matrix | partial | 2 / 3 | MIT |
| cablematters-matrix | Cable Matters Matrix | partial | 2 / 3 | MIT |
| calrec-cscp | Calrec CSCP | list-only | 0 / 6 | MIT |
| camstreamer-camstreamer | camstreamer Camera | no-send | 0 / 0 | MIT |
| canon-ptz | Canon CR-N300 / CR-N500 / CR-N700 / CR-X300 / CR-X500 / XF605 / C300 MkIII / … | partial | 78 / 107 | MIT |
| canon-xf | Canon XF405 / XF705 / C100 / C200 / Browser Remote | no-send | 0 / 34 | MIT |
| captionkit-api | CaptionKit API | full | 2 / 2 | MIT |
| casparcg-server | CasparCG Server | partial | 1 / 15 | ISC |
| castr-api | castr.io API v2 | partial | 1 / 2 | MIT |
| cedar-dns8d | Cedar DNS 8D | no-send | 0 / 10 | MIT |
| chamsys-magicq-osc | ChamSys MagicQ | partial | 3 / 13 | MIT |
| chamsys-magicq-udp | ChamSys MagicQ (UDP) | full | 10 / 10 | MIT |
| chamsys-quickq | Chamsys QuickQ | no-send | 0 / 7 | MIT |
| chilibytes-pdfosc | ChiliBytes PDFOSC | no-send | 0 / 7 | MIT |
| christie-projector | Christie Projector | partial | 66 / 67 | MIT |
| christie-spyder | Christie Spyder X20/X80 | full | 9 / 9 | ISC |
| churchapps-freeshow | ChurchApps FreeShow | list-only | 0 / 42 | MIT |
| chyronhego-lyric | ChyronHego Lyric | partial | 3 / 8 | MIT |
| cinegy-capture | Cinegy Capture | partial | 2 / 3 | MIT |
| cisco-roomos | Cisco RoomOS | no-send | 0 / 32 | MIT |
| classx-mixboard | ClassX MixBoard | partial | 9 / 16 | MIT |
| clearcom-station-ic | Clear-Com Station-IC | no-send | 0 / 6 | MIT |
| cockos-reaper | Cockos REAPER | partial | 15 / 42 | MIT |
| coda-linus | CODA Audio LINUS6.4 | full | 5 / 5 | MIT |
| colorlight-grandshow | Colorlight GrandShow | full | 18 / 18 | MIT |
| colorlight-processor | Colorlight U-Series / Z-Series / X-Series / V-Series / VX-Series / D-Series /… | list-only | 0 / 7 | MIT |
| combitech-vidblasterx | CombiTech VidBlasterX | full | 21 / 21 | MIT |
| companion-satellite | Bitfocus Companion Satellite API | no-send | 0 / 1 | MIT |
| creativeland-capacitimer | Creativeland Capacitimer | partial | 13 / 15 | MIT |
| creativeland-mediacontrolbridge | Creativeland Media Control Bridge | full | 5 / 5 | MIT |
| crestron-digitalmatrix | Crestron DigitalMedia Switcher | no-send | 0 / 0 | MIT |
| crestron-hd-mdnxm-4kz-e | Crestron HD-MD4X1-4KZ-E / HD-MD4X2-4KZ-E / HD-MD8X8-4KZ-E | no-send | 0 / 0 | MIT |
| cuemanager-cuesheetconnector | Cue Manager Cue Sheet Connector | no-send | 0 / 0 | MIT |
| cvmeventi-countdown | CVM Eventi Countdown | failed | 0 / 0 | MIT |
| cyberpower-pdu | CyberPower PDU | partial | 2 / 5 | MIT |
| dahuasecurity-ptz | dahua PTZ Camera | partial | 13 / 15 | MIT |
| dan-dugan-automixer | Dan Dugan Sound Design Model M / Model N | partial | 6 / 50 | MIT |
| dashare-multiplay | da-share MultiPlay | full | 15 / 15 | MIT |
| dashare-multiplay3 | da-Share MultiPlay 3 | no-send | 0 / 15 | MIT |
| dataton-watchout-json | Dataton Watchout 7 | no-send | 0 / 0 | MIT |
| dataton-watchout | Dataton Watchout | partial | 9 / 11 | MIT |
| dbaudiotechnik-amps | d&b audiotechnik 5D / 10D / 30D / 40D / D20 / D40 / D80 | no-send | 0 / 16 | MIT |
| dbaudiotechnik-dsp | D&B Audiotechnik DS100 | partial | 100 / 123 | MIT |
| dcc-ex-commandstation | DCC-EX | partial | 10 / 12 | MIT |
| denon-receiver | Denon AVR | full | 7 / 7 | MIT |
| denon-recorder | Denon DN-900R / DN-700R / DN-500R / DN-F650R / DN-F450R | partial | 6 / 7 | MIT |
| depili-clock-8001 | Depili Clock-8001 | no-send | 0 / 25 | MIT |
| devantech-ds | Devantech DSXXX | full | 2 / 2 | MIT |
| devcore-mixingstation | Mixing Station GmbH Mixing Station | no-send | 0 / 0 | MIT |
| dhdaudio-control-api | DHD Control API | failed | 0 / 0 | MIT |
| dhdaudio-ecp | DHD Audio Series 52 / RM4200D / XD2 / XC2 / SX2 | partial | 2 / 4 | MIT |
| digitalprojection-projectors | DigitalProjection Models supported by Projector Controller II | no-send | 0 / 1 | MIT |
| directout-audioprocessors | DirectOut technologies PRODIGY.MC / PRODIGY.MP / PRODIGY.MX / MAVEN.A | no-send | 0 / 0 | MIT |
| discord-api | Discord API | no-send | 0 / 18 | MIT |
| disguise-liveupdate | Disguise LiveUpdate | no-send | 0 / 4 | MIT |
| disguise-mtc | Disguise - Multi Transport Control | partial | 1 / 2 | MIT |
| disguise-osc | Disguise OSC | no-send | 0 / 35 | MIT |
| disguise-smc | Disguise - SMC | full | 6 / 6 | MIT |
| dmxcontrolprojects-dmxcontrol3 | DMXControl Projects e.V. DMXControl 3 | no-send | 0 / 5 | MIT |
| dolby-cinemaprocessor | Dolby Cinema Processor | partial | 7 / 11 | MIT |
| dtvideolabs-playbackproplus | DT Videolabs PlaybackPro Plus | full | 45 / 45 | MIT |
| easyrecord-cgcontrol | Easyrecord CG control | no-send | 0 / 2 | MIT |
| eaton-epdu | Eaton ePDU | no-send | 0 / 5 | MIT |
| ecamm-live | ecamm Live | no-send | 0 / 27 | MIT |
| elgato-keylight | Elgato Key Light / Ring Light | partial | 3 / 6 | MIT |
| emotimo-st4 | eMotimo ST4 / ST4.3 / SA2.6 | partial | 44 / 73 | MIT |
| epiphan-pearl | Epiphan Pearl | failed | 0 / 0 | MIT |
| epson-businesspj | Epson Business Projectors | partial | 11 / 13 | MIT |
| equipson-lightshark | LightShark LS1 / LS-Core | partial | 43 / 47 | MIT |
| ereca-stageracer | Ereca Stage Racer II | no-send | 0 / 0 | MIT |
| esphome-api | ESPHome API | no-send | 0 / 0 | MIT |
| etc-echo | ETC Echo Integration Interface | full | 10 / 10 | MIT |
| etc-eos | ETC EOS | partial | 5 / 15 | MIT |
| etc-paradigm | ETC Paradigm | no-send | 0 / 8 | MIT |
| etcaudiovisuel-onlyview | ETC Audiovisuel Onlyview | full | 23 / 23 | MIT |
| etl-rfmatrix | ETL Systems ETL RF Matrix | partial | 1 / 9 | MIT |
| evertz-quartz | Evertz EQX Router / EQT Router | partial | 6 / 9 | MIT |
| evertz-symphony | Evertz MVP / VIP / NGI / Exhibit | list-only | 0 / 7 | MIT |
| evertz-vipx | Evertz Vipx | list-only | 0 / 7 | MIT |
| evision-hd102 | Evision HD102 | partial | 3 / 5 | MIT |
| extron-mmx-tcp | Extron MMX 42/62 Series | partial | 6 / 8 | MIT |
| extron-smp351 | Extron SMP 351 | partial | 11 / 12 | MIT |
| eyevinn-intercom | Eyevinn Open Intercom | no-send | 0 / 9 | MIT |
| ezcoo-matrix | EZCOO MX44-HAS2 4x4 HDMI Matrix / MX42HS 4x2 HDMI Matrix | partial | 2 / 4 | MIT |
| figure53-go-button | Figure 53 GoButton with feedback | no-send | 0 / 25 | MIT |
| figure53-qlab-advance | Figure 53 QLab with feedback | partial | 23 / 67 | MIT |
| figure53-qview | Figure 53 QView | no-send | 0 / 3 | MIT |
| fivem-console | FiveM Console | list-only | 0 / 1 | MIT |
| focusrite-mp8r | Focusrite MP8R | list-only | 0 / 3 | MIT |
| foobar2000-foobar2000 | foobar2000 | full | 7 / 7 | MIT |
| fora-mfr | For.A MFR | partial | 7 / 11 | MIT |
| foscam-ptz | foscam PTZ Camera | partial | 13 / 15 | MIT |
| fulldomepro-server | Fulldome.pro Projection Server | no-send | 0 / 28 | MIT |
| gdsys-muxkvmswitch | Guntermann&Drunck DL-DVI-MUX4 | list-only | 0 / 2 | MIT |
| generic-artnet | Art-Net | list-only | 0 / 5 | MIT |
| generic-blink | Button Blinker | no-send | 0 / 1 | MIT |
| generic-bridge | Bridge | no-send | 0 / 2 | MIT |
| generic-dataentry | Data Entry | no-send | 0 / 11 | MIT |
| generic-emberplus | Ember+ | no-send | 0 / 12 | MIT |
| generic-filereader | File Reader | no-send | 0 / 6 | MIT |
| generic-http | HTTP Requests | no-send | 0 / 5 | MIT |
| generic-ical | iCal Scheduler | no-send | 0 / 2 | MIT |
| generic-midi | MIDI | failed | 0 / 0 | MIT |
| generic-modbus | Modbus | no-send | 0 / 1 | MIT |
| generic-mqtt | MQTT | no-send | 0 / 1 | MIT |
| generic-mysql | MySQL / MariaDB | no-send | 0 / 2 | MIT |
| generic-onvif | ONVIF | no-send | 0 / 26 | MIT |
| generic-osc | OSC | no-send | 0 / 8 | MIT |
| generic-ping | Ping | no-send | 0 / 3 | MIT |
| generic-pingandwake | Ping and Wake | no-send | 0 / 7 | MIT |
| generic-pjlink | JBMIA Projector / PJLink | partial | 5 / 6 | MIT |
| generic-ptpv2-client | PTP v2 | no-send | 0 / 0 | MIT |
| generic-rss-client | RSS | no-send | 0 / 1 | MIT |
| generic-sacn | Streaming ACN | list-only | 0 / 2 | MIT |
| generic-smtp | SMTP | no-send | 0 / 1 | MIT |
| generic-snmp | SNMP Requests | no-send | 0 / 6 | ISC |
| generic-speedtest | Speedtest | full | 1 / 1 | MIT |
| generic-ssh | SSH | list-only | 0 / 2 | MIT |
| generic-stopwatch | Stopwatch | no-send | 0 / 8 | MIT |
| generic-swp02 | SW-P-02 / Probel Router SW P 02 / Snell Router SW P 02 | partial | 1 / 4 | MIT |
| generic-swp08 | SW-P-08 / Ross Router / Snell ProBel Router / Grass Valley Router / Lawo VSM … | partial | 2 / 14 | MIT |
| generic-syslog-client | Syslog Client | list-only | 0 / 1 | MIT |
| generic-tcp-serial | TCP Serial Port | no-send | 0 / 2 | MIT |
| generic-tcp-udp | TCP and UDP Requests | partial | 1 / 2 | MIT |
| generic-timezone | Timezone | no-send | 0 / 0 | MIT |
| generic-wakeonlan | Wake-on-LAN | no-send | 0 / 2 | MIT |
| generic-websocket | WebSocket | no-send | 0 / 1 | MIT |
| generic-webtable | Web-Table | no-send | 0 / 7 | MIT |
| getontime-ontime | GetOntime Ontime | no-send | 0 / 0 | MIT |
| glensound-divine | Glensound Divine | partial | 5 / 8 | MIT |
| glensound-minferno | Glensound Minferno | no-send | 0 / 4 | MIT |
| globalcache-itac-cc | Global Cache iTach IP2CC | full | 1 / 1 | MIT |
| globalcache-itac-ir | Global Cache iTach IP2IR | full | 1 / 1 | MIT |
| globalcache-itac-sl | Global Cache iTach IP2SL | partial | 1 / 2 | MIT |
| gnuralnet-livetoair | Gnural Net Live To Air | no-send | 0 / 31 | MIT |
| google-sheets | Google Sheets | no-send | 0 / 5 | MIT |
| govee-lights | Govee Lights | no-send | 0 / 0 | MIT |
| grassvalley-amp | Grass Valley AMP | no-send | 0 / 9 | MIT |
| grassvalley-kframe | GrassValley K-Frame | no-send | 0 / 2 | MIT |
| greengo-intercom | Green-GO Intercom Remote (OSC) | partial | 3 / 12 | MIT |
| greenhippo-hippotizer-rest | Green Hippo Hippotizer | partial | 7 / 11 | MIT |
| gudesystems-smartpdu | Gude Systems Smart PDU | partial | 3 / 4 | MIT |
| h2r-graphics | Here to Record H2R Graphics | partial | 38 / 46 | MIT |
| h2r-layouts | Here to Record H2R Layouts | no-send | 0 / 10 | MIT |
| haivision-connectdvr | Haivision Connect DVR | no-send | 0 / 0 | MIT |
| haivision-kbencoder | Haivision KB Encoder | partial | 4 / 6 | MIT |
| hdkatov-visca | HDkatov VISCA | partial | 37 / 39 | MIT |
| hdtv-wolfpackgreen | HDTV WolfPackGreen HDMI Matrix | partial | 5 / 12 | MIT |
| highend-hog4 | High End Systems Hog 4 | no-send | 0 / 10 | MIT |
| highpass-accompaniment | HighPass AcCompaniment | no-send | 0 / 7 | MIT |
| highpass-countdown | Highpass Countdown | no-send | 0 / 6 | MIT |
| highpass-upc | HighPass UPC -Ultimate Presentation Control | no-send | 0 / 15 | MIT |
| hive-beebox | Hive Beeblade / Beebox | no-send | 0 / 7 | MIT |
| hollyland-solidcom | Hollyland Solidcom | no-send | 0 / 4 | MIT |
| hologfx-holographics | hologfx.io Holographics | no-send | 0 / 6 | MIT |
| homeassistant-server | Home Assistant Server | no-send | 0 / 15 | MIT |
| ibm-watson | IBM Watson | partial | 5 / 6 | MIT |
| iccms-sib | IC Control Media & Sport AB Sport In The Box | partial | 2 / 3 | MIT |
| ictag-easyvideo | ICT AG easyVideo | partial | 6 / 8 | MIT |
| idk-fdx | IDK FDX-S | full | 6 / 6 | MIT |
| idk-msd | IDK MSD-V4 / MSD-V6 | full | 15 / 15 | MIT |
| idk-ninjar | IDK NINJAR | list-only | 0 / 7 | MIT |
| iiyama-prolite | Iiyama Prolite | list-only | 0 / 4 | MIT |
| imagine-lrc | Imagine Communications Logical Router Control | partial | 3 / 12 | MIT |
| imimot-mitti | Imimot Mitti | no-send | 0 / 84 | MIT |
| influxdb-apiv2 | InfluxDB v2 | partial | 1 / 5 | MIT |
| innosonix-maxx | Innosonix Maxx | no-send | 0 / 7 | MIT |
| intelix-matrix | Intelix INT-44HDX / INT-66HDX / INT-88HDX | partial | 4 / 5 | MIT |
| interactivetechnologies-cueserver | Interactive Technologies CueServer | full | 7 / 7 | MIT |
| interspace-cueether | Interspace Industries CueEther | full | 1 / 1 | MIT |
| interspace-mastercuev7 | Interspace Industries MasterCue V7 | partial | 5 / 10 | MIT |
| iobroker-ws | ioBroker WebSockets | no-send | 0 / 5 | MIT |
| ioversal-vertex | ioversal Vertex | partial | 10 / 12 | MIT |
| ipl-ocp | Inkling Performance Labs Overlay Control Panel | partial | 2 / 20 | MIT |
| irisdown-countdowntimer | Irisdown Countdown Timer | full | 9 / 9 | MIT |
| irisdown-remoteshowcontrol | Irisdown Remote Show Control | partial | 9 / 10 | MIT |
| josephadams-gamepadio | Joseph Adams gamepad-io | list-only | 0 / 22 | MIT |
| josephadams-scriptlauncher | Joseph Adams Script Launcher | list-only | 0 / 77 | MIT |
| joy-playdeck | JOY event & media Playdeck | no-send | 0 / 57 | MIT |
| jozeemedia-jcounter | Jozee Media Solutions J-Counter | no-send | 0 / 4 | MIT |
| julusian-test | Julusian Test | no-send | 0 / 1 | MIT |
| justmacros-lua | JustMacros LUA | full | 2 / 2 | MIT |
| jvc-ptz | JVC Camera / KZ100 / PZ510 | no-send | 0 / 23 | MIT |
| kenku-fm | KenkuFM API Controller | partial | 11 / 13 | MIT |
| kiloview-encoder | Kiloview E1 / E2 / E3 / G1 / G2 | no-send | 0 / 0 | MIT |
| kiloview-ndi | Kiloview N40 / N50 / N60 / N5 / N6 | no-send | 0 / 11 | MIT |
| kissbox-gpio | KISSBOX IO3CC / IO8CC | no-send | 0 / 0 | MIT |
| klang-app | Klang App | full | 8 / 8 | MIT |
| klang-immersive | Klang Immersive / Konductor / Vokal / DMI-Klang | full | 12 / 12 | MIT |
| klvr-chargerpro | KLVR Charger Pro | full | 1 / 1 | MIT |
| kommander-t3 | BowTek Kommander T0/T1/T3 / F1/F1Pro/F2/F9 / PS-Series | no-send | 0 / 0 | MIT |
| kramer-matrix | Kramer Matrix (Generic) | no-send | 0 / 8 | MIT |
| kxwell-ptz | KXWell PTZ Camera | partial | 17 / 19 | MIT |
| lea-amplifier | LEA Amplifier | no-send | 0 / 5 | MIT |
| leolabs-ableset | Leolabs AbleSet | partial | 14 / 35 | MIT |
| leonreucher-vstopowerpoint | Leon Reucher PowerPoint Remote VSTO WebSocket | no-send | 0 / 14 | MIT |
| lgtv-display | LG Electronics LG Display | no-send | 0 / 7 | MIT |
| lgtv-prodisplay | LG Pro Display | partial | 7 / 8 | MIT |
| libreoffice-impress | LibreOffice Impress | no-send | 0 / 5 | MIT |
| lightware-lw2 | Lightware LW2 | failed | 0 / 0 | MIT |
| lightware-lw3 | Lightware LW3 | no-send | 0 / 0 | MIT |
| lilliput-monitor | Lilliput Monitor / Q18 | list-only | 0 / 5 | MIT |
| limagiran-holyrics | Lima Giran Ltda. Holyrics | no-send | 0 / 0 | MIT |
| lofas-ndistudioclock | Lofas AB NDI Studio Clock | full | 20 / 20 | MIT |
| logos-proclaim | Logos Proclaim | no-send | 0 / 31 | MIT |
| lost-cause-photographic-controlroom | Lost Cause Photographic ControlRoom | no-send | 0 / 0 | MIT |
| ltn-schedule | LTN Schedule | no-send | 0 / 5 | MIT |
| luminex-gigacore | Luminex GigaCore | partial | 7 / 12 | MIT |
| luminex-luminode | Luminex LumiNode / LumiCore | full | 12 / 12 | MIT |
| lutron-caseta | Lutron Caseta | no-send | 0 / 0 | MIT |
| lyntec-rpc-breaker | LynTec RPC | no-send | 0 / 6 | MIT |
| madrix-aura | Madrix Aura 2/8/12/32 | partial | 4 / 8 | MIT |
| magewell-director | Magewell Director Mini | partial | 48 / 50 | MIT |
| magewell-proconvert-decoder | Magewell Pro Convert Decoder | full | 24 / 24 | MIT |
| magewell-ultrastream | Magewell Ultra Stream HDMI / Ultra Stream SDI / Ultra Encode HDMI / Ultra Enc… | no-send | 0 / 3 | MIT |
| magnimage-mig-ec | Magnimage MIG-EC90 / MIG-EC80 | full | 6 / 6 | MIT |
| malighting-grandma2 | MA Lighting GrandMA2 | partial | 3 / 5 | MIT |
| malighting-grandma3 | MA Lighting GrandMA3 | no-send | 0 / 15 | MIT |
| malighting-msc | MA Lighting dot2 MSC / grandMA2 MSC | partial | 1 / 6 | MIT |
| marshall-ipcamera | Marshall CV355 / CV420 / CV420e / CV620 / CV630 / CV730 | no-send | 0 / 57 | MIT |
| massimo-callegari-qlcplus | massimo-callegari qlcplus / qlc+ | no-send | 0 / 0 | MIT |
| matrox-conductip | Matrox ConductIP | no-send | 0 / 1 | MIT |
| matrox-monarch | Matrox Monarch HD/HDX/LCS | full | 6 / 6 | MIT |
| meld-studio | Meld Studio | no-send | 0 / 6 | MIT |
| metus-player | Metus Technology Player Controller | no-send | 0 / 14 | MIT |
| microsoft-teams | Microsoft Teams | no-send | 0 / 6 | MIT |
| microsoft-vscode | Microsoft VSCode | no-send | 0 / 8 | MIT |
| middleman-adit | Middleman Software AdIT | no-send | 0 / 2 | MIT |
| middleman-breaktime | Middleman Software BreakTime | no-send | 0 / 7 | MIT |
| middleman-scte104proxy | Middleman Software SCTE 104 Proxy | no-send | 0 / 0 | MIT |
| middlethings-middlecontrol | Middle Things Middle Control | partial | 7 / 8 | MIT |
| mixtech-theatremix | Mixing Technology TheatreMix | partial | 21 / 25 | MIT |
| modulopi-moduloplayer | Modulo Pi Modulo Player | no-send | 0 / 23 | MIT |
| monnit-sensors | Monnit Sensors | no-send | 0 / 2 | MIT |
| monospace-lightkey | Monospace Lightkey | no-send | 0 / 13 | MIT |
| monteiro-cronosdown | Monteiro CronosDown | full | 43 / 43 | MIT |
| monteiro-pptvideo | Monteiro PPT-VIDEO | full | 72 / 72 | MIT |
| moxa-e2200series | Moxa e2210 / e2212 / e2214 / e2242 / e2260 / e2262 | partial | 13 / 17 | MIT |
| mrmoco-mhc | Mark Roberts Motion Control MHC | partial | 4 / 13 | MIT |
| mt-viki-matrix | MT VIKI MT-HD0808 8x8 HDMI Matrix | partial | 11 / 13 | MIT |
| multicam-systems-rcp | Multicam Systems RCP | no-send | 0 / 24 | MIT |
| mvr-helios | Megapixel Helios | partial | 14 / 28 | MIT |
| nanoleaf-shapes | Nanoleaf Shapes / Aurora / Canvas / Elements | partial | 15 / 17 | MIT |
| nec-display | NEC Display | partial | 1 / 4 | MIT |
| neodarque-stagetimer2 | Neodarque StageTimer2 | no-send | 0 / 14 | MIT |
| netgear-avline | Netgear AV Line | no-send | 0 / 0 | MIT |
| netio-powerbox | NETIO PowerBOX | no-send | 0 / 0 | MIT |
| netron-en | Netron EN / EN-12 | full | 3 / 3 | MIT |
| neumannmueller-stageflow | Neumann&Müller GmbH & Co. KG Stageflow | no-send | 0 / 18 | MIT |
| neutrik-dpro | Neutrik NA-2-IO-DPRO | partial | 1 / 4 | MIT |
| nevion-mrp | Nevion MRP / Multicon | no-send | 0 / 0 | MIT |
| nevion-videoipath | Nevion VideoIPath | no-send | 0 / 0 | MIT |
| newblue-captivate | NewBlue Captivate | no-send | 0 / 0 | MIT |
| newtek-tricaster | Newtek Tricaster | no-send | 0 / 0 | MIT |
| nexo-nxamp | NEXO NXAMP | full | 3 / 3 | MIT |
| nohassleav-matrix | NoHassleAV Matrix | no-send | 0 / 1 | MIT |
| nohassleav-videowallprocessor | NoHassleAV HDP MXB44VW / Video Wall Processor 4x4 | full | 33 / 33 | MIT |
| noiseproductions-vvd | Noise Productions Virtual Video Director | full | 6 / 6 | MIT |
| noismada-octopusshowcontrol | Octopus Listener | no-send | 0 / 14 | MIT |
| nortek-bluebolt | Nortek Bluebolt | partial | 2 / 6 | MIT |
| notion-timestamp | Notion Timestamp | partial | 1 / 3 | MIT |
| novastar-coex | NovaStar Coex MX40 Pro / CX80 Pro / KU20 | partial | 8 / 10 | MIT |
| novastar-controller | Novastar MCTRL4K / VX4S / VX6S / NovaPro HD / NovaPro UHD Jr / VX1000 / VX600… | partial | 6 / 7 | MIT |
| novastar-mediaserver | Novastar RX6 / FX3 Pro | partial | 20 / 23 | MIT |
| novastar-mxreal3 | NovaStar MxReal 3 | full | 22 / 22 | MIT |
| novastar-splicer | Novastar Splicer | no-send | 0 / 0 | MIT |
| novastar-switcher | NovaStar N10 / N20 / D12 / D32 | partial | 4 / 6 | MIT |
| nrk-sofie-chef | NRK Sofie Chef | no-send | 0 / 4 | MIT |
| ntp-technology-dot | NTP Technology 635-800A / 600 Series / Penta Series | no-send | 0 / 4 | MIT |
| nws-api | National Weather Service Weather Alerts | no-send | 0 / 0 | MIT |
| obs-studio | OBS Studio | no-send | 0 / 0 | MIT |
| obsbot-osc | OBSBOT Center App / Tail 2 / Tail Air / Tiny / Tiny 4K / Tiny 2 / Tiny 2 Lite… | partial | 29 / 31 | MIT |
| obsidiancontrol-onyx-osc | Obsidian Control Systems ONYX | no-send | 0 / 5 | MIT |
| odyssey-insight | Odyssey Development Insight | partial | 6 / 7 | MIT |
| openrgb-sdk | OpenRGB | no-send | 0 / 3 | MIT |
| openweather-rest | OpenWeather Current Weather API | full | 1 / 1 | MIT |
| optimalaudio-zone | Optimal Audio Zone | partial | 2 / 4 | MIT |
| osctimer-osctimer | O:S:C Timer | failed | 0 / 17 | MIT |
| osee-gostream-series | OSEE GoStream_Series | no-send | 0 / 0 | MIT |
| osee-gostream | OSEE GoStream | partial | 52 / 131 | MIT |
| panasonic-av-hs6000 | panasonic AV-HS6000 | list-only | 0 / 2 | MIT |
| panasonic-av-hsw10 | Panasonic AV-HSW10 | partial | 8 / 10 | MIT |
| panasonic-avhs | Panasonic AV-HS50 / AV-HS410 / AV-UHS500 | partial | 4 / 5 | MIT |
| panasonic-camera-controller | Panasonic Remote Camera Controller | full | 4 / 4 | MIT |
| panasonic-cameras | Panasonic Camera | partial | 12 / 50 | MIT |
| panasonic-kairos | Panasonic Kairos | partial | 8 / 16 | MIT |
| panasonic-p2 | Panasonic P2 / CX350 / HC-X2 / HC-X20 | no-send | 0 / 19 | MIT |
| panasonic-projector | Panasonic Projector | no-send | 0 / 18 | MIT |
| panasonic-ptz | Panasonic PTZ Camera | partial | 48 / 61 | MIT |
| panasonic-tv-th | Panasonic TH-84EF1U / TH-75EF1U / TH-85EF1W / TH-75EF1W / TH-98SQ2HW / TH-86E… | full | 6 / 6 | MIT |
| pastebin-api | Pastebin API | no-send | 0 / 4 | MIT |
| peavy-ratc | Peavy NION n3 / NION n6 / NION nE / NION nX | no-send | 0 / 10 | MIT |
| phabrix-qx | Phabrix QX12G | partial | 46 / 47 | MIT |
| pharos-designer | Pharos Designer Controller | full | 4 / 4 | MIT |
| philips-hue | Philips Hue | no-send | 0 / 5 | MIT |
| philips-sicp | Philips SICProtocol | list-only | 0 / 2 | MIT |
| philips-wiz-bulbs | Philips Wiz Bulbs | partial | 3 / 6 | MIT |
| pixap-pixtimerpro | piXap piXtimer Pro | no-send | 0 / 0 | MIT |
| pixelhue-mediaserver | Pixelhue MS3 / MS3 Pro | partial | 20 / 23 | MIT |
| pixelhue-switcher | Pixelhue P10 / P20 / Q8 / P80 | no-send | 0 / 0 | MIT |
| planningcenter-serviceslive | Planning Center Online Services Live | no-send | 0 / 19 | MIT |
| pnh-opencountdown | [Project-Name-Here] opencountdown | license | 0 / 10 | LGPL-3.0 |
| pnh-soundr | [Project-Name-Here] Soundr | license | 0 / 4 | LGPL-3.0 |
| polecam-autopod | Polecam Autopod+ / Panapod | partial | 17 / 22 | MIT |
| powersoft-amplifiers | Powersoft Amplifier | partial | 13 / 19 | MIT |
| presentationtools-aps | PresentationTools Auto Presentation Switcher | partial | 25 / 46 | MIT |
| presentationtools-cuetimer | PresentationTools CueTimer | partial | 33 / 34 | MIT |
| ptzoptics-superjoy | PTZ Optics SuperJoy | partial | 3 / 5 | MIT |
| ptzoptics-visca | PTZoptics VISCA | partial | 35 / 43 | MIT |
| purelink-pt-ma-hd44m | purelink PT-MA-HD44M | partial | 5 / 6 | MIT |
| pushover-api | Pushover | no-send | 0 / 2 | MIT |
| pynch-nexa | Pynch Nexa / EVS / XT / XS / LSM / Hyperdeck | no-send | 0 / 0 | MIT |
| qsys-remote-control | Q-Sys | list-only | 0 / 25 | MIT |
| radiodj-rest | RadioDJ REST API | full | 14 / 14 | MIT |
| raspberry-gpio | Raspberry Pi foundation RPi GPIO | no-send | 0 / 0 | MIT |
| rationalacoustics-smaart3 | Rational Acoustics Smaart V8.3 - V8.5 / Smaart Di 2.1 and newer | no-send | 0 / 32 | MIT |
| red-rcp2 | RED RCP2 Camera Control | no-send | 0 / 21 | MIT |
| renewedvision-propresenter-api | Renewed Vision ProPresenter API | no-send | 0 / 0 | MIT |
| renewedvision-propresenter | Renewed Vision ProPresenter | no-send | 0 / 41 | MIT |
| renewedvision-pvp | Renewed Vision PVP 3 | list-only | 0 / 29 | MIT |
| resi-decoders | Resi Decoder | full | 6 / 6 | MIT |
| resi-studio | Resi Studio | partial | 1 / 2 | MIT |
| resolume-arena | Resolume Arena | partial | 2 / 42 | MIT |
| restream-api | Restream API | no-send | 0 / 0 | MIT |
| rgblink-mini | RGBlink mini/mini+ | partial | 8 / 18 | MIT |
| rgblink-vsp628pro | RGBlink VSP 628pro | partial | 5 / 12 | MIT |
| riedel-mediornet | Riedel Mediornet | no-send | 0 / 0 | MIT |
| riedel-rrcs | Riedel RRCS | no-send | 0 / 0 | MIT |
| riedel-smartpanel | Riedel Communications Smart Panel | no-send | 0 / 20 | MIT |
| rode-rcv | RØDECaster Video (RCV) | no-send | 0 / 15 | MIT |
| rogueamoeba-farrago | Rogue Amoeba Farrago | no-send | 0 / 23 | MIT |
| roku-tv | Roku TV | partial | 5 / 8 | MIT |
| roland-p20hd | Roland P-20HD | no-send | 0 / 24 | MIT |
| roland-v160hd | Roland V-160HD | builtin | 0 / 76 | MIT |
| roland-v600uhd | Roland V-600UHD | partial | 16 / 17 | MIT |
| roland-v60hd | Roland V-60HD | no-send | 0 / 30 | MIT |
| roland-vr120hd | Roland VR-120HD | builtin | 0 / 31 | MIT |
| roland-vr400uhd | Roland VR-400UHD | list-only | 0 / 11 | MIT |
| roland-xs84h | Roland XS-82H / XS-83H / XS-84H | full | 27 / 27 | MIT |
| rossvideo-nkrouter | Ross Video NK Router | no-send | 0 / 1 | MIT |
| rossvideo-rosstalk | Ross Video Rosstalk | partial | 12 / 14 | MIT |
| rossvideo-xpression | Ross Video Xpression | full | 22 / 22 | MIT |
| rundown-studio | Rundown Studio | full | 6 / 6 | MIT |
| samsung-display | Samsung MD Display | partial | 1 / 13 | MIT |
| samsung-smarttv | Samsung Smart TV | no-send | 0 / 2 | MIT |
| samsung-tizenos | Samsung TizenOS | list-only | 0 / 3 | MIT |
| sennheiser-digital6000 | Sennheiser EM 6000 / EM 6000 Dante / L 6000 | partial | 6 / 10 | MIT |
| sennheiser-ewdx | Sennheiser EM2 / EM2 Dante / EM4 / CHG70N / CHG70N-C | partial | 18 / 25 | MIT |
| sevenpointtechnologies-7pointaudio | Seven Point Technologies, LLC 7 Point Audio | full | 17 / 17 | MIT |
| sgl-dct | SGL DCT | no-send | 0 / 23 | MIT |
| shelly-http | Shelly 1 / Shelly 2.5 / Shelly Dimmer1/2 / Shelly RGBW2 | full | 3 / 3 | MIT |
| shelly-ws | Shelly Plus 1 / Shelly Plus 1PM / Shelly Plus 2PM / Shelly Pro 1 / Shelly Pro… | no-send | 0 / 2 | MIT |
| showcuesystems-scs | Show Cue Systems SCS | no-send | 0 / 16 | MIT |
| shure-chargers | Shure SBRC / SB-220 / SB-240 | full | 3 / 3 | MIT |
| shure-dca901 | Shure DCA901 | full | 12 / 12 | MIT |
| shure-mxa910 | Shure MXA910 / MXA920 | partial | 10 / 11 | MIT |
| shure-mxcw | Shure Microflex Complete Wireless (MXCW) | partial | 35 / 38 | MIT |
| shure-mxn5 | Shure MXN-5 | partial | 9 / 10 | MIT |
| shure-mxw | Shure Microflex (MXW) | full | 10 / 10 | MIT |
| shure-p300 | Shure P300 | full | 4 / 4 | MIT |
| shure-psm1000 | Shure PSM1000 | partial | 6 / 7 | MIT |
| shure-scm820 | Shure SCM820 | full | 13 / 13 | MIT |
| shure-wireless | Shure ULX-D / QLX-D / SLX-D / Axient Digital (AD) | partial | 6 / 7 | MIT |
| sikn-kerkomroep | sikn kerkomroep | no-send | 0 / 1 | MIT |
| simedia-yesapi | Si Media Yes Api Gateway | partial | 30 / 35 | MIT |
| simonhyde-piclock | Simon Hyde PiClock | no-send | 0 / 9 | MIT |
| singularlive-studio | Singular.Live Studio | no-send | 0 / 0 | MIT |
| skaarhoj-rawpanel | SKAARHOJ Raw Panel | partial | 2 / 9 | MIT |
| slack-webhooks | Slack Webhooks | no-send | 0 / 3 | MIT |
| smartavi-ipmatrix | Smart-AVI MU-88 / MXU-88 / MXCORE | partial | 1 / 4 | MIT |
| smodetech-smodelive | Smode Live | partial | 21 / 27 | MIT |
| smokotnin-opensoundmeter | Pavel Smokotnin Open Sound Meter | failed | 0 / 2 | MIT |
| snapav-wattbox | Snapav Wattbox | full | 4 / 4 | MIT |
| socialstream-ninja | Social Stream Ninja | no-send | 0 / 10 | MIT |
| softouch-easyworship | Softouch Development Inc EasyWorship | no-send | 0 / 17 | MIT |
| softron-movierecorder | Softron MovieRecorder | partial | 9 / 12 | MIT |
| softron-mreplay | Softron M|Replay | partial | 12 / 13 | MIT |
| softron-multicamlogger | Softron Multicam Logger | partial | 6 / 7 | MIT |
| softron-ontheairvideo | Softron OnTheAir Video | partial | 15 / 18 | MIT |
| softvelum-nimble-streamer | Softvelum Nimble Streamer | partial | 4 / 5 | MIT |
| softvelum-wmspanel | Softvelum WMSPanel | partial | 1 / 23 | MIT |
| songbeamer-osc | Songbeamer OSC | partial | 13 / 16 | MIT |
| sonos-speakers | Sonos Speakers | no-send | 0 / 0 | MIT |
| sony-bravia-simpleip | Sony Bravia Simple IP | partial | 4 / 7 | MIT |
| sony-bravia | Sony Bravia | no-send | 0 / 7 | MIT |
| sony-cled | Sony ZRCT-300 | no-send | 0 / 16 | MIT |
| sony-ptz | Sony BRC-AM7 / SRG-A40 / SRG-A12 / ILME-FR7 | list-only | 0 / 22 | MIT |
| sony-serialtally | Sony XVS 9000/8000/7000/6000 / XVS-G1 / MLS-X1 | partial | 9 / 11 | MIT |
| sony-srg-a12 | Sony SRG-A12 | no-send | 0 / 29 | MIT |
| sony-visca | Sony VISCA | partial | 47 / 66 | MIT |
| soundcraft-ui | Soundcraft Ui12 / Ui16 / Ui24R | no-send | 0 / 0 | MIT |
| sounddevices-pixnet | Sound Devices PIXNET | full | 14 / 14 | MIT |
| soundtrack-remote | Soundtrack Your Brand Remote | no-send | 0 / 0 | MIT |
| spacecommz-intercom | Spacecommz.io SpaceCommz | no-send | 0 / 3 | MIT |
| spotify-remote | Spotify Web API and Controller | no-send | 0 / 18 | MIT |
| spx-graphics-controller | spx gc | partial | 13 / 15 | MIT |
| squared-powerlink | Square D NF3500G4 / NF3000G3 / NF2000G3 | failed | 0 / 2 | MIT |
| stagetec-emberplus-avatus | STAGETEC Official Ember+ Avatus | no-send | 0 / 9 | MIT |
| stagetec-emberplus-nxct | STAGETEC Official Ember+ NEXUS compact | no-send | 0 / 2 | MIT |
| stagetec-rcp | StageTec XDIP / NXC-T | list-only | 0 / 4 | MIT |
| stagetec-xci | Stagetec XCI03 | no-send | 0 / 2 | MIT |
| stagetimerio-api | stagetimer.io Stagetimer API | partial | 27 / 32 | MIT |
| studiocoast-vmix | StudioCoast vMix | partial | 64 / 129 | MIT |
| symetrix-dsp | Symetrix DSP | partial | 7 / 8 | MIT |
| syncer-live | Zusor Syncer.live | full | 1 / 1 | MIT |
| tagvs-mcs | TAG Video Systems MCS | no-send | 0 / 11 | MIT |
| tascam-bdmp1 | Tascam BD-MP1 | partial | 43 / 44 | MIT |
| tascam-cd | Tascam SS-CDR250N / SS-R250N | no-send | 0 / 34 | MIT |
| tascam-cd400u | Tascam CD-400U / CD-400U DAB | no-send | 0 / 17 | MIT |
| tascam-da-6400 | Tascam DA-6400 / DA-6400dp | no-send | 0 / 41 | MIT |
| tasmota-http | Tasmota HTTP | full | 2 / 2 | MIT |
| techministry-beacon | Tech Ministry Beacon | no-send | 0 / 6 | MIT |
| techministry-midirelay | Tech Ministry MIDI Relay | list-only | 0 / 10 | MIT |
| techministry-spotifycontroller | Tech Ministry Spotify Controller | list-only | 0 / 19 | MIT |
| techministry-tallyarbiter | Tech Ministry Tally Arbiter | no-send | 0 / 3 | MIT |
| techministry-timekeeper | Tech Ministry TimeKeeper | list-only | 0 / 8 | MIT |
| telegram-bot | Telegram Bot | no-send | 0 / 0 | MIT |
| telestream-prism | Telestream Prism / MPI2 / MPX2 / MPD / MPP / MPS | partial | 141 / 171 | MIT |
| televic-confero | Televic Plixus MME / Plixus AE-R / Plixus WAP / D-Cerno AE | partial | 3 / 4 | MIT |
| tellyo-streamstudio | Tellyo Stream Studio | no-send | 0 / 0 | MIT |
| telos-25-seven-program-delay-manager | Telos 25-Seven PDM/PDM II Broadcast Delay | partial | 2 / 5 | MIT |
| teradek-prism | Teradek Prism / Prism Flex | no-send | 0 / 7 | MIT |
| teradek-vidiux | Teradek VidiU X | no-send | 0 / 2 | MIT |
| tesla-smart | Tesla smart 8>1 | full | 1 / 1 | MIT |
| tesmart-hdmimatrix | TESMART HDMI Matrix (multiple variants) | partial | 7 / 9 | MIT |
| textmebot-whatsappapi | TextMeBot WhatsAppApi | full | 4 / 4 | MIT |
| theatrixx-xpresscue | Theatrixx xPressCue | no-send | 0 / 15 | MIT |
| thingm-blink1 | ThingM Blink(1) | full | 4 / 4 | MIT |
| tieline-gateway | Tieline Gateway / Via | no-send | 0 / 0 | MIT |
| timemachines-clock | TimeMachines Clock | partial | 14 / 17 | MIT |
| tinkerlist-cuez-automator | TinkerList Cuez - Automator | full | 17 / 17 | MIT |
| toggl-track | Toggl Track | no-send | 0 / 5 | MIT |
| toolsonair-justincapture | ToolsOnAir just:in Capture Solutions | partial | 3 / 6 | MIT |
| tow-mixeffect | Adam Tow MixEffect | no-send | 0 / 278 | MIT |
| tplink-kasasmartbulb | TP-Link Kasa Smart Bulb | no-send | 0 / 0 | MIT |
| tplink-kasasmartdimmer | TP-Link Kasa Smart Dimmer | no-send | 0 / 8 | MIT |
| tplink-kasasmartplug | TP-Link Kasa Smart Plug | no-send | 0 / 3 | MIT |
| tplink-taposmartplug | TP-Link Tapo Smart Plug | no-send | 0 / 5 | MIT |
| tractus-ndirouter | Tractus Events Tractus Router for NDI | failed | 0 / 0 | MIT |
| trms-cablecast | Tightrope Media Systems Cablecast | no-send | 0 / 0 | MIT |
| trms-mediascribe | Tightrope Media Systems MediaScribe | no-send | 0 / 5 | MIT |
| tslproducts-umd | TSL Products UMD protocol | list-only | 0 / 8 | MIT |
| tslproducts-umdlistener | TSL Products UMD Listener | no-send | 0 / 0 | MIT |
| tslproducts-usp3 | TSL Products Universal Switch Panel | full | 2 / 2 | MIT |
| turtleav-mineola | Turtle AV Mineola 2x2 / Mineola 4x4 / Mineola 8x8 / Mineola 16x16 / Phoenix 8x8 | no-send | 0 / 0 | MIT |
| twitch-api | Twitch Chat & API | no-send | 0 / 0 | MIT |
| twoloox-pandorasbox | twoloox Pandoras Box | no-send | 0 / 16 | MIT |
| ubiquiti-unifi | Ubiquiti Unifi / USW | partial | 2 / 3 | MIT |
| uniliga-cg | Uniliga CG | no-send | 0 / 10 | MIT |
| utahscientific-bpspanel | Utah Scientific BPS | no-send | 0 / 3 | MIT |
| uts-remotevolume | UTS Remote Volume | no-send | 0 / 5 | MIT |
| vaddio-ptz | Vaddio PTZ Camera | no-send | 0 / 61 | MIT |
| vbaudio-voicemeeter | VBAudio Voicemeeter | partial | 5 / 29 | MIT |
| vdo-ninja | VDO Ninja | no-send | 0 / 41 | MIT |
| ventuz-director | Ventuz Technology Director | no-send | 0 / 33 | MIT |
| vicreo-broadcast-titles | VICREO Broadcast Titles | no-send | 0 / 14 | MIT |
| vicreo-display | VICREO Display | no-send | 0 / 0 | MIT |
| vicreo-hotkey | VICREO Listener | partial | 20 / 22 | MIT |
| videolan-vlc | VideoLAN VLC | partial | 11 / 18 | MIT |
| vioso-exaplay | vioso exaplay | list-only | 0 / 5 | MIT |
| vistream-online | ViStream online | no-send | 0 / 0 | MIT |
| visualproductions-iocore | Visual Productions IoCore2 | full | 10 / 10 | MIT |
| visualproductions-timecore | Visual Productions Timecore | full | 10 / 10 | MIT |
| vitec-avediaplayer9300-series | Vitec AvediaPlayer r9300 / AvediaPlayer r9310 / AvediaPlayer m9305 / AvediaPl… | partial | 6 / 8 | MIT |
| vivitek-projector | Vivitek Projector | full | 6 / 6 | MIT |
| vizio-smartcast | VIZIO SmartCast | partial | 2 / 7 | MIT |
| vizrt-mosart | Vizrt Mosart | partial | 45 / 52 | MIT |
| vizrt-tcp-engine-trio | vizRT Send Command Line | full | 1 / 1 | MIT |
| voicemod-api | Voicemod | no-send | 0 / 0 | MIT |
| vrowllabs-vrsync | VR Owl Labs VR Sync | no-send | 0 / 4 | MIT |
| vyv-photon | VYV Photon | partial | 2 / 4 | MIT |
| webcomms-panel | Web Comms Panel | failed | 0 / 0 | MIT |
| wheatstone-wheatnet | Wheatstone WheatNet IP | partial | 13 / 16 | MIT |
| wled-websocket | WLED | no-send | 0 / 7 | MIT |
| wordnik-api | Wordnik API | partial | 2 / 3 | MIT |
| wyrestorm-matrix | Wyrestorm Matrix Switcher | list-only | 0 / 3 | MIT |
| yamaha-rcp | Yamaha RCP | partial | 44 / 118 | MIT |
| youtube-live | Google YouTube | no-send | 0 / 0 | MIT |
| zenvideo-ndirouter | ZEN NDIRouter | list-only | 0 / 3 | MIT |
| zerodensity-realityhub | Zerodensity RealityHub 1.3 | no-send | 0 / 0 | MIT |
| zinc-oscpoint | Zinc OSCPoint | no-send | 0 / 30 | MIT |
| zipsolutions-zipcaptions | Zip Solutions Zip Captions | no-send | 0 / 1 | MIT |
| zoom-osc-iso | Zoom OSC/ISO | partial | 29 / 170 | MIT |
| zoom-tiles | Zoom Tiles | partial | 19 / 25 | MIT |
| zowietek-api | Zowietek ZowieBox / ZowiePTZ / ZowieCam | no-send | 0 / 32 | MIT |
