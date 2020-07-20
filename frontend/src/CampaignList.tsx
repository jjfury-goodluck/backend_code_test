import React, { useEffect } from 'react';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { getCampaign, voting, registerHKID, getCampaignWithClient } from './redux/campaign/thunk';
import './CampaignList.scss';
import { useFormState } from 'react-use-form-state';
import { socket } from './socket';



function CampaignList() {
    const campaigns = useSelector((oldstate: RootState) => oldstate.campaign.campaign);
    const client = useSelector((oldstate: RootState) => oldstate.campaign.client);
    const message = useSelector((oldstate: RootState) => oldstate.campaign.message);
    const dispatch = useDispatch();
    const [formState, { text }] = useFormState()
    const curTime = moment()

    function submit(candidate: string, campaignId: number, hkid: string, clientId: number, candidateId: number) {
        confirmAlert({
            title: 'Confirm to vote',
            message: `Are you sure to vote ${candidate} ?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await dispatch(voting(campaignId, hkid, clientId, candidateId));
                    }
                },
                {
                    label: 'No',
                    onClick: () => null
                }
            ]
        });
    };

    useEffect(() => {
        if (!client) {
            dispatch(getCampaign())
        } else {
            dispatch(getCampaignWithClient(client.id))
        }
    }, [dispatch, client])

    useEffect(() => {
        const newVoteListener = () => {
            if (!client) {
                dispatch(getCampaign())
            } else {
                dispatch(getCampaignWithClient(client.id))
            }
        }

        socket.on('new_vote', newVoteListener)

        return () => {
            socket.off('new_vote', newVoteListener)
        }
    }, [dispatch, client])

    return (
        <div>
            <form className="hkid_container" onSubmit={async (e) => {
                e.preventDefault();
                await dispatch(registerHKID(formState.values.hkid));
            }}>
                <div>Register your HKID before vote</div>
                <input  {...text(`hkid`)} placeholder="E.g. A123456(7)" />
                <input type="submit" value="Register"></input>
            </form>
            {message && message}
            {campaigns[0] === undefined ? null :
                campaigns?.map((campaign, i) => {
                    return (
                        <div key={i + 1} className="campaign_box">
                            {(moment(campaign.to_time).isAfter(curTime) && moment(campaign.from_time).isSameOrBefore(curTime)) ?
                                <div key={(i + 1) * 70} className="campaign_ongoing">Ongoing</div> :
                                (moment(campaign.to_time).isSameOrBefore(curTime)) ?
                                    <div key={(i + 1) * 60} className="campaign_over">It's over.</div> :
                                    <div key={(i + 1) * 80} className="campaign_incoming">Incoming</div>
                            }
                            <div key={(i + 1) * 10} className="time_container">
                                From:
                            <span key={(i + 1) * 20} className="time_decorate">
                                    {moment(campaign.from_time).format("YYYY MMMM DD - HH:mm")}
                                </span>
                            To:
                            <span key={(i + 1) * 30} className="time_decorate">
                                    {moment(campaign.to_time).format("YYYY MMMM DD - HH:mm")}
                                </span>
                            </div>
                            <div key={(i + 1) * 40} className='campaign_name'>{campaign.name}</div>


                            {(moment(campaign.to_time).isAfter(curTime) && moment(campaign.from_time).isSameOrBefore(curTime)) ?
                                campaign.candidates.map((candidate, j) => {
                                    return (
                                        <div key={j + "vote_result_container"} className="vote_result_container">
                                            <span key={j + "candidate_ongoing"} className="candidate_ongoing"
                                                onClick={async (e) => {
                                                    if (client?.hkid && client.id) {
                                                        await submit(candidate.name, campaign.id, client?.hkid, client?.id, candidate.id);
                                                    } else {
                                                        alert("Please register HKID first!");
                                                    }
                                                }}>{candidate.name}</span>
                                            <label key={j + "vote_result"} >{candidate.vote}</label>
                                            {candidate.youVoted ? "(You voted)" : null}
                                        </div>
                                    )
                                }) :
                                (moment(campaign.from_time).isAfter(curTime)) ?
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
                                                {candidate.youVoted ? "(You voted)" : null}
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