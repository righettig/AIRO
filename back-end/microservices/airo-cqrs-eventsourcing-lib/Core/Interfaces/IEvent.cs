﻿namespace airo_cqrs_eventsourcing_lib.Core.Interfaces;

public interface IEvent
{
    DateTime CreatedAt { get; }
}