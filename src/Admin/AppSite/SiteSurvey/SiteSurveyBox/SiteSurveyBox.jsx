import React, { Component } from 'react';
import { surveyService } from '../../../../_services';
import { SiteSurveyBoxNav } from './SiteSurveyBoxNav';
import { SiteSurveyBoxStep } from './SiteSurveyBoxStep';
import { Link } from 'react-router-dom';
import { BsPencil} from 'react-icons/bs';

class SiteSurveyBox extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            appSiteId: props.appSiteId,
            siteSurveyId: props.siteSurveyId,
            siteSurvey: null,
            surveySteps: [],
            surveyStepId: props.surveyStepId,
            selectedSurveyStep: null
        };                   
    }        

    componentDidMount() {
        this.getSiteSurvey()
        this.getSurveySteps()
    }

    getSiteSurvey = () => {
        surveyService.getSiteSurveyById(this.state.appSiteId,this.state.siteSurveyId)
            .then((x) => { 
                this.setState({
                    siteSurvey: x 
                })                        
            });
    }

    getSurveySteps = () => {        
        surveyService.getStepsOfSurvey(this.state.appSiteId,this.state.siteSurveyId)
            .then((x) => { 
                this.setState({
                    surveySteps: x.result 
                })                        
            });
    }

    handleChange = (value) =>  {
        this.setState({
            surveyStepId: value.surveyStepId,
            selectedSurveyStep: value 
        })                     
    }    

    render() {
        return (
            <>
            <Link title="Modifica il percorso" to={`/admin/sites/sitesurveys/edit/${this.state.appSiteId}/${this.state.siteSurveyId}`} className="flex items-center justify-center rounded-md bg-blue-200 mt-2 p-1 text-blue-900">
                <BsPencil /> Modifica il percorso
            </Link>
            {/* {this.state.siteSurvey && 
            <div style={{backgroundColor: this.state.siteSurvey.boxColor}} className="mt-2 rounded shadow">
                {this.state.surveySteps && this.state.surveySteps.length > 0 &&                 
                <SiteSurveyBoxNav 
                    surveySteps={this.state.surveySteps} 
                    surveyStepId={this.state.surveyStepId} 
                    onChange={(step) => this.handleChange(step)} />}
                {this.state.selectedSurveyStep && 
                <SiteSurveyBoxStep 
                    appSiteId={this.state.appSiteId} 
                    siteSurveyId={this.state.siteSurveyId} 
                    surveyStepId={this.state.surveyStepId} 
                    surveyStep={this.state.selectedSurveyStep} />}
            </div>} */}
            </>
        )
    }
}

export { SiteSurveyBox };