import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';

/**
 * Custom hook to listen for real-time events and invalidate React Query cache.
 * 
 * @param channelName The name of the private channel.
 * @param eventName The broadcast event name.
 * @param queryKey The React Query key to invalidate.
 */
export const useRealTimeUpdates = (
    channelName: string,
    eventName: string,
    queryKey: string[]
) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = echo.private(channelName);
        
        channel.listen(eventName, (data: any) => {
            console.log(`Real-time update received on ${channelName} for event ${eventName}:`, data);
            queryClient.invalidateQueries({ queryKey });
        });

        return () => {
            channel.stopListening(eventName);
            echo.leave(channelName);
        };
    }, [channelName, eventName, queryClient, queryKey]);
};
