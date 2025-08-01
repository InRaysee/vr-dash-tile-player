var FOVRule;

// Rule that selects the possible bitrate according to FOV
function FOVRuleClass() {

    var appElement = document.querySelector('[ng-controller=DashController]');
    var $scope = angular.element(appElement).scope();
    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let context = this.context;
    let instance;

    function setup() {
    }

    // Always select a bitrate according to FOV
    function getMaxIndex(rulesContext) {
        const switchRequest = SwitchRequest(context).create();

        if (!rulesContext || !rulesContext.hasOwnProperty('getMediaInfo') || !rulesContext.hasOwnProperty('getAbrController')) {
            return switchRequest;
        }

        const mediaType = rulesContext.getMediaInfo().type;
        const mediaInfo = rulesContext.getMediaInfo();
        const abrController = rulesContext.getAbrController();

        if (mediaType != "video") {  // Default settings for audio
            return switchRequest;           
        }

        // Compute the bitrate according to FOV
        var info = abrController.getSettings().info;
        var priorite = computeQualities(info);  // From 0 to 100

        // Ask to switch to the bitrate according to FOV
        switchRequest.quality = 0;
        switchRequest.reason = 'Always switching to the bitrate according to FOV';
        switchRequest.priority = SwitchRequest.PRIORITY.STRONG;

        const bitrateList = abrController.getBitrateList(mediaInfo);  // List of all the selectable bitrates (A - Z)
        for (let i = bitrateList.length - 1; i >= 0; i--) {
            if (priorite >= (i * 100 / bitrateList.length)) {
                switchRequest.quality = i;
                break;
            }
        }

        return switchRequest;
    }

    function computeQualities(info) {

        if (!info) {
            console.log("Lack of info when computing FOV-based qualities!!!");
            return 0;
        }

        if ($scope.playerFOVScore && $scope.playerFOVScore[info.count]) {
            return $scope.playerFOVScore[info.count];
        }

        if ($scope.playerDivation && $scope.playerDivation[info.count]) {
            return 100 * (($scope.playerDivation[info.count] - Math.min($scope.playerDivation)) / (Math.max($scope.playerDivation) - Math.min($scope.playerDivation))); 
        }

        if ($scope.lat == NaN || $scope.lon == NaN || $scope.lat > 90 || $scope.lat < -90 || $scope.lon > 360 || $scope.lon < 0) {
            console.log("Wrong $scope.lat & $scope.lon when computing FOV-based qualities!!!");
            return 0;
        }
    
        if ( info.face == '0' ) {
            if ( $scope.lat == 0 && $scope.lon % 360 == 180 ) {
                return 100;
            } else {
                if ( $scope.lon % 360 <= 225 && $scope.lon % 360 >= 135 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 75;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( $scope.lon % 360 <= 270 && $scope.lon % 360 >= 90 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 50;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 25;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        }

        if ( info.face == '1' ) {
            if ( $scope.lat == 0 && $scope.lon % 360 == 0 ) {
                return 100;
            } else {
                if ( $scope.lon % 360 <= 45 || $scope.lon % 360 >= 315 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 75;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( $scope.lon % 360 <= 90 || $scope.lon % 360 >= 270 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 50;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 25;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        }

        if ( info.face == '2' ) {
            if ( $scope.lat >= 85 ) {
                return 100;
            } else if ( $scope.lat >= 80 ) {
                return 75;
            } else if ( $scope.lat >= 45 ) {
                return 50;
            } else if ( $scope.lat >= 0 ) {
                return 25;
            } else {
                return 0;
            }
        }

        if ( info.face == '3' ) {
            if ( $scope.lat <= -85 ) {
                return 100;
            } else if ( $scope.lat <= -80 ) {
                return 75;
            } else if ( $scope.lat <= -45 ) {
                return 50;
            } else if ( $scope.lat <= 0 ) {
                return 25;
            } else {
                return 0;
            }
        }

        if ( info.face == '4' ) {
            if ( $scope.lat == 0 && $scope.lon % 360 == 90 ) {
                return 100;
            } else {
                if ( $scope.lon % 360 <= 135 && $scope.lon % 360 >= 45 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 75;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( $scope.lon % 360 <= 180 && $scope.lon % 360 >= 0 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 50;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 25;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        }

        if ( info.face == '5' ) {
            if ( $scope.lat == 0 && $scope.lon % 360 == 270 ) {
                return 100;
            } else {
                if ( $scope.lon % 360 <= 315 && $scope.lon % 360 >= 225 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 75;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( $scope.lon % 360 <= 360 && $scope.lon % 360 >= 180 ) {
                    if ( $scope.lat <= 45 && $scope.lat >= -45 ) {
                        return 50;
                    } else if ( $scope.lat >= -80 && $scope.lat <= 80 ) {
                        return 25;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        }

        return 0;
    }

    instance = {
        getMaxIndex: getMaxIndex,
        computeQualities: computeQualities
    };

    setup();

    return instance;
}

FOVRuleClass.__dashjs_factory_name = 'FOVRule';
FOVRule = dashjs.FactoryMaker.getClassFactory(FOVRuleClass);

