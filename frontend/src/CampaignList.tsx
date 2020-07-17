import React, { useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { getCampaign, voting } from './redux/campaign/thunk';
import './CampaignList.scss';
import { useFormState } from 'react-use-form-state';



function CampaignList() {
    const campaigns = useSelector((oldstate: RootState) => oldstate.campaign.campaign);
    const dispatch = useDispatch();
    const [formState, { text }] = useFormState()
    const curTime = moment.tz(moment(), 'Hongkong')

    function submit(candidate: string, campaignId: number, hkid: string, candidateId: number) {
        if (hkid === '') {
            alert("Please enter HKID !")
        } else if (hkid.length !== 10 &&
            hkid.match(/^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/) === null) {
            alert("Incorrect HKID !")
        } else {
            confirmAlert({
                title: 'Confirm to vote',
                message: `Are you sure to vote ${candidate} ?`,
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await dispatch(voting(campaignId, hkid, candidateId));
                            formState.clear();
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => null
                    }
                ]
            });
        }

    };

    useEffect(() => {
        dispatch(getCampaign())
    }, [dispatch, campaigns])


    return (
        <div>
            <div className="hkid_container">
                <div>Input your HKID before vote</div>
                <input  {...text(`hkid`)} placeholder="E.g. A123456(7)" />
            </div>
            {campaigns[0] === undefined ? null :
                campaigns?.map((campaign, i) => {
                    return (
                        <div key={i + 1} className="campaign_box">
                            {(moment.tz(campaign.to_time, 'Hongkong') >= curTime && moment.tz(campaign.from_time, 'Hongkong') <= curTime) ?
                                <div key={(i + 1) * 70} className="campaign_ongoing">Ongoing</div> :
                                (moment.tz(campaign.to_time, 'Hongkong') <= curTime) ?
                                    <div key={(i + 1) * 60} className="campaign_over">It's over.</div> :
                                    <div key={(i + 1) * 80} className="campaign_incoming">Incoming</div>
                            }
                            <div key={(i + 1) * 10} className="time_container">
                                From:
                            <span key={(i + 1) * 20} className="time_decorate">
                                    {moment.tz(campaign.from_time, 'Hongkong').format("YYYY MMMM DD - HH:mm")}
                                </span>
                            To:
                            <span key={(i + 1) * 30} className="time_decorate">
                                    {moment.tz(campaign.to_time, 'Hongkong').format("YYYY MMMM DD - HH:mm")}
                                </span>
                            </div>
                            <div key={(i + 1) * 40} className='campaign_name'>{campaign.name}</div>


                            {(moment.tz(campaign.to_time, 'Hongkong') >= curTime && moment.tz(campaign.from_time, 'Hongkong') <= curTime) ?
                                campaign.candidates.map((candidate, j) => {
                                    return (
                                        <div key={j + "vote_result_container"} className="vote_result_container">
                                            <span key={j + "candidate_ongoing"} className="candidate_ongoing"
                                                onClick={async (e) => {
                                                    await submit(candidate.name, campaign.id, formState.values.hkid, candidate.id);
                                                }}>{candidate.name}</span>
                                            <label key={j + "vote_result"} >{candidate.vote}</label>
                                        </div>
                                    )
                                }) :
                                (moment.tz(campaign.from_time, 'Hongkong') > curTime) ?
                                    campaign.candidates.map((candidate, j) => {
                                        return (
                                            <span key={j + "not_yet_started"} className="not_yet_started">{candidate.name}</span>
                                        )
                                    }) :
                                    campaign.candidates.map((candidate, j) => {
                                        return (
                                            <div key={j + "vote_result_container"} className="vote_result_container">
                                                <span key={j + "candidate_result"} className="candidate_result">{candidate.name}</span>
                                                <label key={j + "vote_result"} >{candidate.vote}</label>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    )
                })}
        </div >
    );
}

export default CampaignList;