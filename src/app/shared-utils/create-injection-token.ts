import { InjectOptions, InjectionToken, Provider, Type, inject } from '@angular/core';

type CreateInjectionTokenDeps<
    TFactory extends (...args: any[]) => any,
    TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>
> = {
    [Index in keyof TFactoryDeps]:
        | Type<TFactoryDeps[Index]>
        // TODO we don't have an AbstractType
        | (abstract new (...args: any[]) => TFactoryDeps[Index])
        | InjectionToken<TFactoryDeps[Index]>;
} & { length: TFactoryDeps['length'] };

type CreateInjectionTokenOptions<
    TFactory extends (...args: any[]) => any,
    TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>
> =
    // this means TFunction has no arguments
    (TFactoryDeps[0] extends undefined
        ? {
              isRoot: boolean;
              deps?: never;
          }
        : {
              isRoot?: boolean;
              deps: CreateInjectionTokenDeps<TFactory, TFactoryDeps>;
          }) & {
        extraProviders?: Provider;
    };

type CreateInjectionTokenReturn<
    TFactory extends (...args: any[]) => any,
    TFactoryReturn extends ReturnType<TFactory> = ReturnType<TFactory>
> = [
    // TODO: this should take into account { optional: true }
    (injectOptions?: InjectOptions) => TFactoryReturn,
    () => Provider,
    InjectionToken<TFactoryReturn>
];

function createInjectFn<TValue>(token: InjectionToken<TValue>) {
    return (injectOptions?: InjectOptions) => inject(token, injectOptions as InjectOptions);
}

function createProvideFn<
    TValue,
    TFactory extends (...args: any[]) => any = (...args: any[]) => TValue,
    TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>
>(
    token: InjectionToken<TValue>,
    factory: (...args: any[]) => TValue,
    deps?: CreateInjectionTokenDeps<TFactory, TFactoryDeps>,
    extraProviders?: Provider
) {
    return () => {
        const provider = {
            provide: token,
            useFactory: factory,
            deps: deps ?? [],
        };
        return extraProviders ? [extraProviders, provider] : provider;
    };
}

export function createInjectionToken<
    TFactory extends (...args: any[]) => any,
    TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
    TFactoryReturn extends ReturnType<TFactory> = ReturnType<TFactory>
>(
    factory: TFactory,
    options?: CreateInjectionTokenOptions<TFactory, TFactoryDeps>
): CreateInjectionTokenReturn<TFactory, TFactoryReturn> {
    const opts = options ?? ({ isRoot: true } as CreateInjectionTokenOptions<TFactory, TFactoryDeps>);

    opts.isRoot ??= true;

    if (opts.isRoot) {
        const token = new InjectionToken<TFactoryReturn>(`Token for ${factory.name}`, {
            factory: () => {
                if (opts.deps && Array.isArray(opts.deps)) {
                    return factory(...opts.deps.map((dep) => inject(dep)));
                }
                return factory();
            },
        });

        return [
            createInjectFn(token) as CreateInjectionTokenReturn<TFactory, TFactoryReturn>[0],
            createProvideFn(token, factory, opts.deps as any[]),
            token,
        ];
    }

    const token = new InjectionToken<TFactoryReturn>(`Token for ${factory.name}`);
    return [
        createInjectFn(token) as CreateInjectionTokenReturn<TFactory, TFactoryReturn>[0],
        createProvideFn(token, factory, opts.deps as any[], opts.extraProviders),
        token,
    ];
}
