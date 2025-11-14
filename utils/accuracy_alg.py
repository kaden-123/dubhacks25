import numpy as np

#for now only calcualte position accuracy for ALL algorithms
axes = 'position'

def pck():
    return 0

# note that pose_compare already uses threshold, just count number of nonzeros
def thresh(compared_data):
    error_count = 0
    for axes in ['position', 'velocity', 'acceleration']:
        for coord in ['x', 'y', 'z']:
            values = compared_data[axes][coord]
            if len(values) == 0:
                continue
            last = values[-1]  # numpy array of landmark coords
            if last is None:
                continue
            error_count += np.count_nonzero(last)
    return error_count



def mse(compared_data):
    return (
        (compared_data[axes][-1].x) ** 2 + 
        (compared_data[axes][-1].y) ** 2 + 
        (compared_data[axes][-1].z) ** 2
    )