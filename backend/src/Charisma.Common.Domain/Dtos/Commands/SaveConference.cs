using MediatR;
using NBB.Messaging.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos.Commands
{
    [TopicName("Charisma.Commands.SaveConference")] //mesageria nats -> sa stie pe ce topic sunt primite comenzile de acest tip
    //api face un publish de saveconference command
    //worker face subscribe la acest topic si preia comenzile
    public record SaveConference(ConferenceDto Conference) : IRequest;
}
