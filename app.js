// START -- Minimum required app modules
const appModules = new class {
    loadingModule(graph) {
        return new class {
            // Required property that is used in other modules
            loadingWasSuccessFul = false;

            successfullyLoadedOntology() {
                return this.loadingWasSuccessFul;
            }
            validJsonFile() {
                this.loadingWasSuccessFul = true;
            }


            collapseDetails() { }
            setErrorMode() { }


            setPercentMode() { }
            setPercentValue(val) {
                // WebVOWL app uses:
                // d3.select("#progressBarValue").node().innherHTML = val;
            }

            missingImportsWarning() { }
            showWarningDetailsMessage() { }


            /* ** Custom methods ** */

            loadOntology(fileToRead) {
                d3.xhr(fileToRead, "application/json", (error, request) => {
                    var loadingSuccessful = !error;
                    if (loadingSuccessful) {
                        const ontologyContent = request.responseText;
                        this._loadOntologyFromText(ontologyContent);
                    } else {
                        console.log(error);
                    }
                });
            }

            _loadOntologyFromText(jsonText, filename = "NAME") {
                if ((jsonText === undefined && filename === undefined) || (jsonText.length === 0)) {
                    console.log("INVALID: EMPTY");
                    return;
                }

                graph.editorMode(false);

                let data;
                if (jsonText) {
                    try {
                        data = JSON.parse(jsonText);
                    } catch (e) {
                        console.log("INVALID: PARSE");
                        return;
                    }
                }

                // check if we have graph data
                let classCount = 0;
                if (data.class !== undefined) {
                    classCount = data.class.length;
                }

                if (classCount === 0) {
                    console.log("INVALID: EMPTY");
                } else {
                    this.validJsonFile();

                    graph.options().data(data);
                    graph.load();
                    graph.updateZoomSliderValueFromOutside();
                }
            }
        }
    }

    warningModule() {
        return new class {
            closeFilterHint() { }
            showEditorHint() { }
        }
    }

    ontologyMenu() {
        return new class {
            append_bulletPoint() { }
            append_message_toLastBulletPoint() { }
        }
    }

    sidebar() {
        return new class {
            updateShowedInformation() { }
            clearOntologyInformation() { }
        }
    }

    editSidebar() {
        return new class {
            clearMetaObjectValue() { }
            updateGeneralOntologyInfo() { }
            updatePrefixUi() { }
            updateElementWidth() { }
            updateSelectionInformation() { }
        }
    }

    leftSidebar() {
        return new class {
            isSidebarVisible() { }
            showSidebar() { }
            hideCollapseButton() { }
        }
    }

    searchMenu() {
        return new class {
            requestDictionaryUpdate() { }
            clearText() { }
        }
    }

    zoomSlider() {
        return new class {
            updateZoomSliderValue() { }
        }
    }

};

// END -- Minimum required app modules


window.app = new class {
    initialize() {
        // START -- Instantiate the base lib objects

        const graph = webvowl.graph("#graph");

        const options = graph.graphOptions();
        options.graphObject(graph);

        // END -- Instantiate the base lib objects


        // START -- Instantiate modules inside the library

        const colorExternalsSwitch = webvowl.modules.colorExternalsSwitch(graph);
        options.filterModules().push(colorExternalsSwitch);
        options.colorExternalsModule(colorExternalsSwitch);

        const compactNotationSwitch = webvowl.modules.compactNotationSwitch(graph);
        options.filterModules().push(compactNotationSwitch);
        options.compactNotationModule(compactNotationSwitch);

        const datatypeFilter = webvowl.modules.datatypeFilter();
        options.filterModules().push(datatypeFilter);
        options.datatypeFilter(datatypeFilter);

        const disjointFilter = webvowl.modules.disjointFilter();
        options.filterModules().push(disjointFilter);
        options.disjointPropertyFilter(disjointFilter);

        const focuser = webvowl.modules.focuser(graph);
        options.selectionModules().push(focuser);
        options.focuserModule(focuser);

        const emptyLiteralFilter = webvowl.modules.emptyLiteralFilter();
        options.filterModules().push(emptyLiteralFilter);
        options.literalFilter(emptyLiteralFilter);

        const nodeScalingSwitch = webvowl.modules.nodeScalingSwitch(graph);
        options.filterModules().push(nodeScalingSwitch);

        const objectPropertyFilter = webvowl.modules.objectPropertyFilter();
        options.filterModules().push(objectPropertyFilter);
        options.objectPropertyFilter(objectPropertyFilter);

        const pickAndPin = webvowl.modules.pickAndPin();
        options.selectionModules().push(pickAndPin);
        options.pickAndPinModule(pickAndPin);

        const statistics = webvowl.modules.statistics();
        options.filterModules().push(statistics);

        const subclassFilter = webvowl.modules.subclassFilter();
        options.filterModules().push(subclassFilter);
        options.subclassFilter(subclassFilter);

        const setOperatorFilter = webvowl.modules.setOperatorFilter();
        options.filterModules().push(setOperatorFilter);
        options.setOperatorFilter(setOperatorFilter);

        // END -- Instantiate modules inside the library


        // START -- Instantiate minimum required modules NOT in the library
        // The modules only has empty methods for the happy path.
        // More investigation will require to extract all the necessary methods for every app module
        // And if more modules are needed or need an exact configuration

        const loadingModule = appModules.loadingModule(graph);
        options.loadingModule(loadingModule);

        const warningModule = appModules.warningModule();
        options.warningModule(warningModule);

        const ontologyMenu = appModules.ontologyMenu();
        options.ontologyMenu(ontologyMenu);

        const sidebar = appModules.sidebar();
        options.sidebar(sidebar);

        const editSidebar = appModules.editSidebar();
        options.editSidebar(editSidebar);

        const leftSidebar = appModules.leftSidebar();
        options.leftSidebar(leftSidebar);

        const searchMenu = appModules.searchMenu();
        options.searchMenu(searchMenu);

        const zoomSlider = appModules.zoomSlider();
        options.zoomSlider(zoomSlider);

        // END -- Instantiate minimum required modules NOT in the library


        // START -- Start graph

        // Manually set the size to the browser size
        function adjustSize() {
            const graphContainer = d3.select("#graph");
            const svg = graphContainer.select("svg");

            const height = window.innerHeight;
            const width = window.innerWidth;

            graphContainer.style("height", height + "px");

            svg.attr("width", width).attr("height", height);
            graph.options().width(width).height(height);
            graph.updateStyle();
        }
        d3.select(window).on("resize", adjustSize);
        adjustSize();

        graph.start();

        const fileToRead = "./ind-demo-vowl.json";
        loadingModule.loadOntology(fileToRead);

        // END -- Start graph
    }
}
