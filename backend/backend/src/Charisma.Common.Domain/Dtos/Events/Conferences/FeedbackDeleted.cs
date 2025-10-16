using MediatR;
using NBB.Messaging.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Dtos.Events.Conferences
{
    [TopicName("Charisma.Events.Conferences.FeedbackDeleted")]

    public record FeedbackDeleted (int Id) : INotification;
}
