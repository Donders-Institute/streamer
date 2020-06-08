import { useState, useEffect, Dispatch } from "react";

import {
    ErrorType,
    ErrorState, 
    ErrorAction,
    initialErrorState,
    UploadState,
    UploadAction,
    UploadActionType,
    UploadStatus
} from "../../types/types";

// Set error state to no error
export const resetError = async (errorDispatch: Dispatch<ErrorAction>) => {
    return errorDispatch({
        type: initialErrorState.errorType,
        payload: { ...initialErrorState}
    } as ErrorAction);
};

// Update error state
const updateError = async ({
    error, 
    errorType, 
    errorDispatch
} : {
    error: Error | null, 
    errorType: ErrorType, 
    errorDispatch: Dispatch<ErrorAction>
}) => {
    if (error) {
        // Update the error state with the caught error message
        try {
            return errorDispatch({
                type: errorType,
                payload: {
                    errorType,
                    errorMessage: error.message
                } as ErrorState
            } as ErrorAction);
        } catch (err) {
            return errorDispatch({
                type: ErrorType.ErrorUnknown,
                payload: {
                    errorType: ErrorType.ErrorUnknown,
                    errorMessage: err.message
                } as ErrorState
            } as ErrorAction);
        }
    }

    // Otherwise reset the error to no error
    return resetError(errorDispatch);
};

// Custom hook to update error state and upload state
export const useUpdateError = ({
    isLoading,
    error,
    errorType,
    errorDispatch,
    uploadState,
    uploadDispatch
} : {
    isLoading: boolean;
    error: Error | null;
    errorType: ErrorType;
    errorDispatch: Dispatch<ErrorAction>;
    uploadState: UploadState;
    uploadDispatch: Dispatch<UploadAction>;
}) => {
    useEffect(() => {
        // Check for error
        const check = async (error: Error | null) => {
            if (error) {
                // Update the error state
                await updateError({
                    error,
                    errorType,
                    errorDispatch
                });

                // Update the upload state
                // Skip selection errors
                if (uploadState.status !== UploadStatus.Selecting) {
                    return uploadDispatch({
                        type: UploadActionType.Error,
                        payload: { ...uploadState }
                    });
                }
            }
        };
        check(error);
    }, [uploadState.status, isLoading, error, errorType]);
};