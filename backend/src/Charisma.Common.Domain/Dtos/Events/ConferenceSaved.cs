using MediatR;
using NBB.Messaging.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos.Events
{
    [TopicName("Charisma.Events.ConferenceSaved")]
    public record ConferenceSaved(int ConferenceId) : INotification
    {
    }
}
