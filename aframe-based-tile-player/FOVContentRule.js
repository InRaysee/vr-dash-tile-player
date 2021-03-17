var FOVContentRule;

// Rule that selects the possible bitrate according to FOV and Content
function FOVContentRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let context = this.context;
    let instance;

    function setup() {
    }

    // Always select a bitrate according to FOV and Content
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

        var info = abrController.getSettings().info;
        // Compute the bitrate according to FOV
        var priorite_FOV = computeFOVQualities(info);  // From 0 to 100
        // Compute the bitrate according to Content
        var priorite_Content = computeContentQualities(info);  // From 0 to 100
        var priorite_FOVContent = 0.5 * priorite_FOV + 0.5 * priorite_Content;

        // Ask to switch to the bitrate according to FOV and Content
        switchRequest.quality = 0;
        switchRequest.reason = 'Always switching to the bitrate according to FOV';
        switchRequest.priority = SwitchRequest.PRIORITY.STRONG;

        const bitrateList = abrController.getBitrateList(mediaInfo);  // List of all the selectable bitrates (A - Z)
        for (let i = bitrateList.length - 1; i >= 0; i--) {
            if (priorite_FOVContent >= (i * 100 / bitrateList.length)) {
                switchRequest.quality = i;
                break;
            }
        }

        return switchRequest;
    }

    function computeFOVQualities(info) {

        if (!info) {
            console.log("Lack of info when computing FOV-based qualities!!!");
            return 0;
        }

        if (lat == NaN || lon == NaN || lat > 90 || lat < -90 || lon > 360 || lon < 0) {
            console.log("Wrong lat & lon when computing FOV-based qualities!!!");
            return 0;
        }
    
        if ( info.face == '0' ) {
            if ( lat == 0 && lon % 360 == 180 ) {
                return 100;
            } else {
                if ( lon % 360 <= 225 && lon % 360 >= 135 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 75;
                    } else if ( lat >= -80 && lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( lon % 360 <= 270 && lon % 360 >= 90 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 50;
                    } else if ( lat >= -80 && lat <= 80 ) {
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
            if ( lat == 0 && lon % 360 == 0 ) {
                return 100;
            } else {
                if ( lon % 360 <= 45 || lon % 360 >= 315 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 75;
                    } else if ( lat >= -80 && lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( lon % 360 <= 90 || lon % 360 >= 270 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 50;
                    } else if ( lat >= -80 && lat <= 80 ) {
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
            if ( lat >= 85 ) {
                return 100;
            } else if ( lat >= 80 ) {
                return 75;
            } else if ( lat >= 45 ) {
                return 50;
            } else if ( lat >= 0 ) {
                return 25;
            } else {
                return 0;
            }
        }

        if ( info.face == '3' ) {
            if ( lat <= -85 ) {
                return 100;
            } else if ( lat <= -80 ) {
                return 75;
            } else if ( lat <= -45 ) {
                return 50;
            } else if ( lat <= 0 ) {
                return 25;
            } else {
                return 0;
            }
        }

        if ( info.face == '4' ) {
            if ( lat == 0 && lon % 360 == 90 ) {
                return 100;
            } else {
                if ( lon % 360 <= 135 && lon % 360 >= 45 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 75;
                    } else if ( lat >= -80 && lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( lon % 360 <= 180 && lon % 360 >= 0 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 50;
                    } else if ( lat >= -80 && lat <= 80 ) {
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
            if ( lat == 0 && lon % 360 == 270 ) {
                return 100;
            } else {
                if ( lon % 360 <= 315 && lon % 360 >= 225 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 75;
                    } else if ( lat >= -80 && lat <= 80 ) {
                        return 50;
                    } else {
                        return 0;
                    }
                } else if ( lon % 360 <= 360 && lon % 360 >= 180 ) {
                    if ( lat <= 45 && lat >= -45 ) {
                        return 50;
                    } else if ( lat >= -80 && lat <= 80 ) {
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

    function computeContentQualities(info) {
        
        if (!info) {
            console.log("Lack of info when computing content-based qualities!!!");
            return 0;
        }

        if (!csv_results) {
            console.log("Lack of csv_results when computing content-based qualities!!!");
            return 0;
        }

        // gains from current segment's level
        let currentTime = parseInt(playerTime[info.face * contents.row * contents.col + info.row * contents.col + info.col] + playerBufferLength[info.face * contents.row * contents.col + info.row * contents.col + info.col]);
        let currentIndex = parseInt(currentTime / info.duration) + 1;
        let currentIndexString = info.face.toString() + "_" + (info.row * contents.col + info.col).toString() + "_" + currentIndex.toString();
        if (csv_results[currentIndexString] == NaN || csv_results['maximum'] == NaN || csv_results['minimum'] == NaN) {
            console.log("Lack of current/maximum/minimum csv_result when computing content-based qualities!!!");
            return 0;
        }
        let currentResult = csv_results[currentIndexString];
        let MaximumResult = csv_results['maximum'];
        let MinimumResult = csv_results['minimum'];
        let RankingResult = (currentResult - MinimumResult) / (MaximumResult - MinimumResult);

        // gains from tile's level
        let curTileIndexString = info.face.toString() + "_" + (info.row * contents.col + info.col).toString();
        if (csv_results[curTileIndexString] != NaN || csv_results['average'] != NaN) {
            let curTileResult = csv_results[curTileIndexString];
            let AverageResult = csv_results['average'];
            if (curTileResult >= AverageResult) {
                RankingResult = Math.min(RankingResult + 0.1, 1);
            } else {
                RankingResult = Math.max(RankingResult - 0.1, 0);
            }
        }

        return RankingResult.toFixed(2) * 100;
    }

    instance = {
        getMaxIndex: getMaxIndex,
        computeFOVQualities: computeFOVQualities,
        computeContentQualities: computeContentQualities
    };

    setup();

    return instance;
}

FOVContentRuleClass.__dashjs_factory_name = 'FOVContentRule';
FOVContentRule = dashjs.FactoryMaker.getClassFactory(FOVContentRuleClass);