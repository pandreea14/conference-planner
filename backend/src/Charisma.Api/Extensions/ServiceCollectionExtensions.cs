using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Charisma.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void TryAddScopedContravariant<TBase, TResolve>(this IServiceCollection serviceCollection, Assembly assembly = null)
        {
            if (!typeof(TBase).IsGenericType || typeof(TBase).GetTypeInfo().IsGenericTypeDefinition)
                return;

            var baseDescription = typeof(TBase).GetGenericTypeDefinition();
            var typeArguments = typeof(TBase).GetGenericArguments();
            var firstTypeArgument = typeArguments.First();
            var restTypeArguments = typeArguments.Skip(1);

            var types = (assembly ?? firstTypeArgument.Assembly).ScanFor(firstTypeArgument);
            foreach (var t in types)
                serviceCollection.TryAddScoped(baseDescription.MakeGenericType(restTypeArguments.Prepend(t).ToArray()), typeof(TResolve));
        }

        public static IEnumerable<Type> ScanFor(this Assembly assembly, Type assignableType)
        {
            return assembly.GetTypes().Where(t => assignableType.IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);
        }

        public static IServiceCollection TryAddContravariantEventHandler<TEventHandler>(this IServiceCollection serviceCollection, IEnumerable<Type> eventTypes)
        {
            var evHandlerInterface = typeof(INotificationHandler<>);
            foreach (var t in eventTypes)
                serviceCollection.TryAddScoped(evHandlerInterface.MakeGenericType(t), typeof(TEventHandler));

            return serviceCollection;
        }

        public static IServiceCollection RemoveImplementationsOf<TEventHandlerBase>(this IServiceCollection serviceCollection)
        {
            var descriptorsToRemove = serviceCollection.Where(x => typeof(TEventHandlerBase).IsAssignableFrom(x.ImplementationType)).ToList();

            foreach (var descriptor in descriptorsToRemove)
                serviceCollection.Remove(descriptor);

            return serviceCollection;
        }
    }
}
